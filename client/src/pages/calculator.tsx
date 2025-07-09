import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Trash2, MemoryStick } from 'lucide-react';

interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: string | null;
  memory: number;
  history: HistoryItem[];
  waitingForNewValue: boolean;
}

interface HistoryItem {
  calculation: string;
  result: string;
  timestamp: Date;
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    memory: 0,
    history: [],
    waitingForNewValue: false,
  });

  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousCalculation, setPreviousCalculation] = useState<string>('');

  const updateDisplay = useCallback((newState: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  }, []);

  const addToHistory = useCallback((calculation: string, result: string) => {
    const historyItem: HistoryItem = {
      calculation,
      result,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      history: [historyItem, ...prev.history.slice(0, 49)], // Keep last 50
    }));
  }, []);

  const handleNumber = useCallback((num: string) => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return { ...prev, currentValue: num, waitingForNewValue: false };
      } else {
        return { ...prev, currentValue: prev.currentValue === '0' ? num : prev.currentValue + num };
      }
    });
  }, []);

  const handleOperation = useCallback((op: string) => {
    setState(prev => {
      if (prev.operation && !prev.waitingForNewValue) {
        // Perform calculation with previous operation
        const result = calculate(parseFloat(prev.previousValue), parseFloat(prev.currentValue), prev.operation);
        setPreviousCalculation(`${prev.currentValue} ${getOperationSymbol(op)}`);
        return {
          ...prev,
          currentValue: result.toString(),
          previousValue: result.toString(),
          operation: op,
          waitingForNewValue: true,
        };
      }
      
      setPreviousCalculation(`${prev.currentValue} ${getOperationSymbol(op)}`);
      return {
        ...prev,
        previousValue: prev.currentValue,
        operation: op,
        waitingForNewValue: true,
      };
    });
  }, []);

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return { ...prev, currentValue: '0.', waitingForNewValue: false };
      } else if (prev.currentValue.indexOf('.') === -1) {
        return { ...prev, currentValue: prev.currentValue + '.' };
      }
      return prev;
    });
  }, []);

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) throw new Error('Cannot divide by zero');
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = useCallback(() => {
    setState(prev => {
      if (prev.operation && prev.previousValue !== '') {
        try {
          const result = calculate(
            parseFloat(prev.previousValue),
            parseFloat(prev.currentValue),
            prev.operation
          );
          
          addToHistory(
            `${prev.previousValue} ${getOperationSymbol(prev.operation)} ${prev.currentValue}`,
            result.toString()
          );
          
          setPreviousCalculation('');
          setError(null);
          
          return {
            ...prev,
            currentValue: result.toString(),
            previousValue: '',
            operation: null,
            waitingForNewValue: true,
          };
        } catch (error) {
          showError((error as Error).message);
          return prev;
        }
      }
      return prev;
    });
  }, [addToHistory, showError]);

  const handleClear = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: '0',
      previousValue: '',
      operation: null,
      waitingForNewValue: false,
    }));
    setPreviousCalculation('');
    setError(null);
  }, []);

  const handleAdvancedOperation = useCallback((operation: string) => {
    setState(prev => {
      const current = parseFloat(prev.currentValue);
      let result: number;
      let calculationDisplay: string;
      
      try {
        switch (operation) {
          case 'percentage':
            result = current / 100;
            calculationDisplay = `${current}%`;
            break;
          case 'square-root':
            if (current < 0) throw new Error('Invalid input');
            result = Math.sqrt(current);
            calculationDisplay = `√${current}`;
            break;
          case 'square':
            result = current * current;
            calculationDisplay = `${current}²`;
            break;
          default:
            return prev;
        }
        
        addToHistory(calculationDisplay, result.toString());
        setError(null);
        
        return {
          ...prev,
          currentValue: result.toString(),
          waitingForNewValue: true,
        };
      } catch (error) {
        showError((error as Error).message);
        return prev;
      }
    });
  }, [addToHistory, showError]);

  const handleMemoryOperation = useCallback((operation: string) => {
    setState(prev => {
      const current = parseFloat(prev.currentValue);
      
      switch (operation) {
        case 'memory-clear':
          return { ...prev, memory: 0 };
        case 'memory-recall':
          return { ...prev, currentValue: prev.memory.toString(), waitingForNewValue: true };
        case 'memory-add':
          return { ...prev, memory: prev.memory + current };
        case 'memory-subtract':
          return { ...prev, memory: prev.memory - current };
        default:
          return prev;
      }
    });
  }, []);

  const getOperationSymbol = (op: string): string => {
    const symbols: { [key: string]: string } = { '+': '+', '-': '-', '*': '×', '/': '÷' };
    return symbols[op] || op;
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      
      if (key >= '0' && key <= '9') {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        handleOperation(key);
      } else if (key === '.') {
        handleDecimal();
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClear();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperation, handleDecimal, handleEquals, handleClear]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {/* Main Calculator */}
        <Card className="w-full lg:w-96 mx-auto p-6 bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Calculator</h1>
            <div className="flex items-center gap-2">
              {state.memory !== 0 && (
                <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <MemoryStick className="w-3 h-3" />
                  <span>M</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <History className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Display */}
          <div className="bg-gray-100 rounded-xl p-4 mb-6 min-h-[100px] flex flex-col justify-end">
            <div className="text-gray-600 text-sm mb-2 font-mono overflow-hidden">
              {previousCalculation}
            </div>
            <div className="text-right">
              <input
                type="text"
                className="w-full bg-transparent text-3xl font-mono font-semibold text-gray-900 text-right outline-none"
                value={state.currentValue}
                readOnly
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* MemoryStick Functions Row */}
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleMemoryOperation('memory-clear')}
            >
              <span className="text-sm">MC</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleMemoryOperation('memory-recall')}
            >
              <span className="text-sm">MR</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleMemoryOperation('memory-add')}
            >
              <span className="text-sm">M+</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleMemoryOperation('memory-subtract')}
            >
              <span className="text-sm">M-</span>
            </Button>

            {/* Advanced Operations Row */}
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleAdvancedOperation('percentage')}
            >
              <span className="text-lg">%</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleAdvancedOperation('square-root')}
            >
              <span className="text-lg">√</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={() => handleAdvancedOperation('square')}
            >
              <span className="text-lg">x²</span>
            </Button>
            <Button
              className="calculator-btn bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleClear}
            >
              <span className="text-lg">C</span>
            </Button>

            {/* Number and Operation Buttons */}
            {[7, 8, 9].map(num => (
              <Button
                key={num}
                variant="secondary"
                className="calculator-btn"
                onClick={() => handleNumber(num.toString())}
              >
                <span className="text-xl">{num}</span>
              </Button>
            ))}
            <Button
              className="calculator-btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleOperation('/')}
            >
              <span className="text-xl">÷</span>
            </Button>

            {[4, 5, 6].map(num => (
              <Button
                key={num}
                variant="secondary"
                className="calculator-btn"
                onClick={() => handleNumber(num.toString())}
              >
                <span className="text-xl">{num}</span>
              </Button>
            ))}
            <Button
              className="calculator-btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleOperation('*')}
            >
              <span className="text-xl">×</span>
            </Button>

            {[1, 2, 3].map(num => (
              <Button
                key={num}
                variant="secondary"
                className="calculator-btn"
                onClick={() => handleNumber(num.toString())}
              >
                <span className="text-xl">{num}</span>
              </Button>
            ))}
            <Button
              className="calculator-btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleOperation('-')}
            >
              <span className="text-xl">-</span>
            </Button>

            <Button
              variant="secondary"
              className="calculator-btn col-span-2"
              onClick={() => handleNumber('0')}
            >
              <span className="text-xl">0</span>
            </Button>
            <Button
              variant="secondary"
              className="calculator-btn"
              onClick={handleDecimal}
            >
              <span className="text-xl">.</span>
            </Button>
            <Button
              className="calculator-btn bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleOperation('+')}
            >
              <span className="text-xl">+</span>
            </Button>

            <Button
              className="calculator-btn bg-green-600 hover:bg-green-700 text-white col-span-4"
              onClick={handleEquals}
            >
              <span className="text-xl">=</span>
            </Button>
          </div>
        </Card>

        {/* History Panel */}
        {showHistory && (
          <Card className="w-full lg:w-80 p-6 bg-white rounded-2xl shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">History</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                className="text-gray-600 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {state.history.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">🧮</div>
                  <p>No calculations yet</p>
                  <p className="text-sm">Your calculation history will appear here</p>
                </div>
              ) : (
                state.history.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-3 hover:bg-gray-200 cursor-pointer transition-colors"
                    onClick={() => {
                      setState(prev => ({
                        ...prev,
                        currentValue: item.result,
                        waitingForNewValue: true,
                      }));
                    }}
                  >
                    <div className="text-sm text-gray-600">{item.calculation}</div>
                    <div className="text-lg font-semibold text-gray-900">= {item.result}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatTime(item.timestamp)}</div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
