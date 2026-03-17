import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('taskflow-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Persistence
  useEffect(() => {
    localStorage.setItem('taskflow-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-zinc-200">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-zinc-900 rounded-xl">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">TaskFlow</span>
            </div>
            <h1 className="text-4xl font-light tracking-tight">Your Daily Focus</h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-zinc-400 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Input Section */}
        <form onSubmit={addTodo} className="relative mb-8 group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-white border-none rounded-2xl py-5 pl-6 pr-16 shadow-sm focus:ring-2 focus:ring-zinc-900 transition-all placeholder:text-zinc-300 text-lg"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/10"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {/* Stats & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
          <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  filter === f 
                    ? 'bg-zinc-900 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {stats.completed} Done
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
              {stats.active} Pending
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`group flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-transparent hover:border-zinc-100 transition-all ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex-shrink-0 transition-colors ${
                      todo.completed ? 'text-emerald-500' : 'text-zinc-300 hover:text-zinc-400'
                    }`}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  
                  <div className="flex-grow min-w-0">
                    <p className={`text-base font-medium truncate transition-all ${
                      todo.completed ? 'line-through text-zinc-400' : 'text-zinc-700'
                    }`}>
                      {todo.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3" />
                        {new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
                  <Calendar className="w-8 h-8 text-zinc-300" />
                </div>
                <h3 className="text-zinc-900 font-medium">No tasks found</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {filter === 'all' 
                    ? "Enjoy your free time!" 
                    : `No ${filter} tasks to show.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        {todos.length > 0 && (
          <footer className="mt-12 pt-8 border-t border-zinc-200 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
            <div>TaskFlow v1.0</div>
            <div>{stats.active} tasks remaining</div>
          </footer>
        )}
      </div>
    </div>
  );
}
