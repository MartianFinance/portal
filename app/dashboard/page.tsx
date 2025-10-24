'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/Header'
import { StatCard } from '@/components/StatCard'
import { AgentControls } from '@/components/AgentControls'
import { ActivityFeed } from '@/components/ActivityFeed'
import { PerformanceChart } from '@/components/PerformanceChart'
import { useAgentStatus } from '@/hooks/useAgentStatus'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import io, { Socket } from 'socket.io-client'

// NOTE: socket.io-client is required. Please install it with: npm install socket.io-client

const SOCKET_URL = "http://127.0.0.1:5001";

export default function Dashboard() {
  const { status, isLoading: isAgentStatusLoading } = useAgentStatus()

  interface Message {
    sender: "user" | "agent";
    content: string | StrategyProposal | UnsignedTransactionProposal | StatusMessage;
    timestamp: string;
  }

  interface StrategyProposal {
    type: "strategy_proposal";
    title: string;
    description: string;
    details: Record<string, string>;
    strategy_id: string;
  }

  interface UnsignedTransactionProposal {
    type: "unsigned_transaction_proposal";
    unsigned_tx_b64: string;
    strategy_id: string;
  }

  interface StatusMessage {
    type: "status_update";
    message: string;
    agent_name?: string;
    progress?: number;
    timestamp: string;
  }

  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<Message[]>([])
  const [isSending, setIsSending] = useState(false)
  const [autoExecute, setAutoExecute] = useState(false)
  const [activeProposal, setActiveProposal] = useState<StrategyProposal | null>(null)
  const [activeUnsignedTransaction, setActiveUnsignedTransaction] = useState<UnsignedTransactionProposal | null>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const { publicKey, signTransaction, connected } = useWallet()
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const savedAutoExecute = localStorage.getItem("autoExecute");
    if (savedAutoExecute !== null) {
      setAutoExecute(JSON.parse(savedAutoExecute));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("autoExecute", JSON.stringify(autoExecute));
  }, [autoExecute]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (spotlightRef.current) {
        const { clientX, clientY } = event
        spotlightRef.current.style.left = `${clientX}px`
        spotlightRef.current.style.top = `${clientY}px`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('agent_response', (data) => {
      console.log("Agent response received:", data);
      const agentResponseContent = data.response;
      const agentMessage: Message = { 
        sender: 'agent', 
        content: agentResponseContent, 
        timestamp: new Date().toLocaleTimeString() 
      };

      setChatHistory(prev => [...prev, agentMessage]);
      setIsSending(false);

      if (typeof agentResponseContent === 'object' && agentResponseContent.type === 'strategy_proposal') {
        if (autoExecute) {
          handleAcceptStrategy(agentResponseContent);
        } else {
          setActiveProposal(agentResponseContent);
        }
      } else if (typeof agentResponseContent === 'object' && agentResponseContent.type === 'unsigned_transaction_proposal') {
        setActiveUnsignedTransaction(agentResponseContent);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      socket.disconnect();
    };
  }, [autoExecute]); // Re-run if autoExecute changes

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socketRef.current) return;

    setIsSending(true);
    const userMessage: Message = {
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userMessage]);
    
    socketRef.current.emit('chat_message', { message });
    setMessage('');
  };

  const handleAcceptStrategy = (proposal: StrategyProposal) => {
    setActiveProposal(null);
    const executeMessage = { command: "execute", payload: { strategy_id: proposal.strategy_id, strategy_description: proposal.description, feePayer: publicKey?.toBase58() } };
    const userActionMessage: Message = {
        sender: "user",
        content: `Accepted: ${proposal.title}`,
        timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userActionMessage]);
    socketRef.current?.emit('chat_message', { message: JSON.stringify(executeMessage) });
  };

  const handleRejectStrategy = (proposal: StrategyProposal) => {
    setActiveProposal(null);
    const userActionMessage: Message = {
        sender: "user",
        content: `Rejected: ${proposal.title}`,
        timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userActionMessage]);
  };

  const handleSignAndSubmitTransaction = async (unsignedTxProposal: UnsignedTransactionProposal) => {
    if (!publicKey || !signTransaction || !connected) {
      toast.error("Please connect your wallet to sign the transaction.");
      return;
    }

    setActiveUnsignedTransaction(null);

    try {
      const transaction = Transaction.from(Buffer.from(unsignedTxProposal.unsigned_tx_b64, 'base64'));
      const signedTx = await signTransaction(transaction);
      const signedTx_b64 = signedTx.serialize().toString('base64');

      const submitCommand = {
        command: "submit_signed_tx",
        payload: {
            signed_tx_b64: signedTx_b64,
            strategy_id: unsignedTxProposal.strategy_id,
        }
      };

      const userActionMessage: Message = {
        sender: "user",
        content: `Signing and submitting transaction for strategy: ${unsignedTxProposal.strategy_id}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, userActionMessage]);
      socketRef.current?.emit('chat_message', { message: JSON.stringify(submitCommand) });

    } catch (error) {
      console.error("Failed to sign or submit transaction:", error);
      const errorMessage: Message = { sender: 'agent', content: `Failed to sign or submit transaction: ${error.message || error}.`, timestamp: new Date().toLocaleTimeString() };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleRejectUnsignedTransaction = (unsignedTxProposal: UnsignedTransactionProposal) => {
    setActiveUnsignedTransaction(null);
    const userActionMessage: Message = {
        sender: "user",
        content: `Rejected transaction for strategy: ${unsignedTxProposal.strategy_id}`,
        timestamp: new Date().toLocaleTimeString(),
    };
    setChatHistory(prev => [...prev, userActionMessage]);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text.");
    }
  };

  const renderContent = (content: Message['content']) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }

    switch (content.type) {
      case 'strategy_proposal':
        return (
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {content.details && Object.entries(content.details).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span>{value}</span>
                </div>
              ))}
              {activeProposal?.strategy_id === content.strategy_id && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleRejectStrategy(content)}>Reject</Button>
                  <Button size="sm" onClick={() => handleAcceptStrategy(content)}>Accept</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'unsigned_transaction_proposal':
        return (
          <Card className="bg-background/50">
            <CardHeader>
              <CardTitle>Transaction Ready for Signing</CardTitle>
              <CardDescription>A transaction has been prepared. Please review and sign.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Strategy ID:</span>
                <span>{content.strategy_id}</span>
              </div>
              {activeUnsignedTransaction?.strategy_id === content.strategy_id && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => handleRejectUnsignedTransaction(content)}>Reject</Button>
                  <Button size="sm" onClick={() => handleSignAndSubmitTransaction(content)}>Sign & Submit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'status_update':
        return (
          <Card className="bg-muted/50 border-l-4 border-primary py-2 px-4">
            <div className="flex items-center space-x-2">
              {content.agent_name && <span className="font-semibold text-primary text-xs">{content.agent_name}:</span>}
              <p className="text-xs text-muted-foreground">{content.message}</p>
            </div>
            {content.progress !== undefined && (
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <div className="bg-primary h-1 rounded-full" style={{ width: `${content.progress * 100}%` }}></div>
              </div>
            )}
          </Card>
        );
      default:
        return <p>{JSON.stringify(content)}</p>;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

  return (
    <div className="min-h-screen bg-background">
      <div ref={spotlightRef} className="spotlight" />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stat cards */}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <AgentControls />
            <div className="bg-card p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Chat with Martian</h3>
                    <div className="flex items-center space-x-2">
                    <Checkbox
                        id="auto-execute"
                        checked={autoExecute}
                        onCheckedChange={(checked) => setAutoExecute(checked as boolean)}
                    />
                    <Label htmlFor="auto-execute">Auto-Execute</Label>
                    </div>
                </div>
                <ScrollArea className="space-y-4 h-64 overflow-y-auto mb-4 p-2 border rounded bg-background">
                    {chatHistory.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex flex-col my-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                        className={`max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {renderContent(msg.content)}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
                        {typeof msg.content === 'string' && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 ml-2" onClick={() => handleCopy(msg.content)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                        {typeof msg.content === 'object' && msg.content.type === 'unsigned_transaction_proposal' && (
                          <Button variant="ghost" size="icon" className="h-6 w-6 mt-1 ml-2" onClick={() => handleCopy(msg.content.unsigned_tx_b64)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                    </div>
                    ))}
                    {isSending && (
                    <div className="flex items-start">
                        <div className="max-w-lg p-3 rounded-lg bg-muted">
                            <p>Thinking...</p>
                        </div>
                    </div>
                    )}
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask Martian anything..."
                    className="flex-grow"
                    disabled={isSending || activeProposal !== null}
                    />
                    <Button type="submit" disabled={isSending || activeProposal !== null}>
                    {isSending ? '...' : 'Send'}
                    </Button>
                </form>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <PerformanceChart />
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  )
}