import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Heart, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';

export default function ChatbotOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '¡Hola Manu y Eve! Soy Nidi, su asistente IA de pareja y del hogar en su nido de amor EvÜ (Manu + Eve). 🌸 Pídanme ideas de citas en El Salvador o en casa, planifiquen su menú que ahora pueden fijar oficialmente en su tablero quincenal por fechas, u organicemos sus tareas de hogar. ¿En qué les puedo ayudar hoy?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Ay, tuve un pequeño contratiempo al procesar la respuesta. Pero no se preocupen: ¿qué tal si preparamos plátanos fritos calientes con frijoles o planeamos una ida al Boquerón en lo que vuelvo en sí? ☕',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('¿Quieres reiniciar nuestra conversación?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: '¡Hola de nuevo! Estoy listo para escuchar sus ideas. ¿Qué preparemos de menú hoy?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  return (
    <>
      {/* Active Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="btn-chatbot"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-stone-800 to-amber-900 text-white rounded-full p-4 shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 duration-200"
          title="Asistente Inteligente Cozy"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span className="text-sm font-medium tracking-wide">Platicar con Nidi</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          id="cozy-chatbot-panel"
          className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-warm-200 dark:border-warm-700 glass-light dark:glass-dark bg-stone-50/95 dark:bg-stone-900/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-stone-800 to-amber-950 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-medium text-sm flex items-center gap-1.5">
                  Nidi AI <Heart className="h-3 w-3 fill-amber-400 text-amber-400 inline" />
                </h3>
                <p className="text-[11px] text-warm-300 font-mono tracking-wide">Compañera de Hogar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="hover:bg-white/10 p-1.5 rounded-md text-stone-300 hover:text-white transition-colors"
                title="Limpiar chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-md text-stone-300 hover:text-white transition-colors"
                title="Cerrar chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 select-none text-xs font-bold font-display">
                    N
                  </div>
                )}
                <div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-amber-800 text-stone-50 rounded-tr-none'
                        : 'bg-warm-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-tl-none border border-warm-200/50 dark:border-stone-700/50'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className={`text-[9px] text-warm-400 font-mono mt-1 block ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 mr-auto max-w-[82%]">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 text-xs font-bold animate-bounce">
                  N
                </div>
                <div className="p-3 rounded-2xl bg-warm-100 dark:bg-stone-800 text-stone-500 rounded-tl-none flex items-center gap-1.5 border border-warm-200/50 dark:border-stone-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce duration-1000"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Tags */}
          <div className="px-4 py-2 border-t border-warm-200/70 dark:border-warm-800 bg-stone-50/50 dark:bg-stone-900/50 flex gap-2 overflow-x-auto whitespace-nowrap text-[11px] scrollbar-thin">
            <button
              onClick={() => setInput('Sugiérenos una cita romántica en El Boquerón')}
              className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-md border border-warm-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer transition-colors"
            >
              Cita Boquerón ⛰️
            </button>
            <button
              onClick={() => setInput('Genéranos un menú quincenal balanceado a base de frijoles, plátanos, pollo, arroz y huevos')}
              className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-md border border-warm-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer transition-colors"
            >
              Menú Quincenal 📅
            </button>
            <button
              onClick={() => setInput('¿Cómo repartirnos las tareas del hogar equitativamente esta semana?')}
              className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-md border border-warm-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer transition-colors"
            >
              Organizar Chores 🧹
            </button>
            <button
              onClick={() => setInput('¿Qué utilidades tiene esta aplicación para nosotros y cómo ganamos puntos?')}
              className="px-2.5 py-1 bg-white dark:bg-stone-800 rounded-md border border-warm-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-500 dark:hover:border-amber-500 cursor-pointer transition-colors"
            >
              Ayuda de la App ❓
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-warm-200 dark:border-warm-800 flex gap-2 bg-white dark:bg-stone-900"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a Nidi..."
              className="flex-1 px-3 py-2 border rounded-xl text-xs dark:bg-stone-800 dark:border-stone-700 dark:text-warm-100 border-warm-200 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-amber-900 text-stone-50 rounded-xl hover:bg-stone-800 disabled:opacity-55 active:scale-95 transition-all text-xs cursor-pointer focus:outline-none"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
