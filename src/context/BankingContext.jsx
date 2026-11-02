import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { initialTransactions } from '../data/mockTransactions';
import { mockCardsList } from '../data/mockCards';
import { initialSavingsGoals } from '../data/mockSavings';
import { investmentPortfolio as initialPortfolio } from '../data/mockInvestments';

const BankingContext = createContext();

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};

export const BankingProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('fb_theme');
    return saved ? saved : 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('fb_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User state
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    role: 'Quantitative Architect & Founder',
    accountType: 'Platinum Sovereign Tier',
    accountNumber: 'FB-9028-4412-8800',
    ifsc: 'FUTR0009821',
    upiId: 'alexmorgan@futurebank',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    currency: 'INR',
    currencySymbol: '₹',
  });

  // Financial Balances (prompt values)
  const [availableBalance, setAvailableBalance] = useState(845200.00);
  const [investedAmount, setInvestedAmount] = useState(439360.80);
  const totalBalance = availableBalance + investedAmount; // ~12,84,560.80
  const monthlyChange = '+12.8%';

  // Core Data Lists
  const [transactions, setTransactions] = useState(initialTransactions);
  const [cards, setCards] = useState(mockCardsList);
  const [savingsGoals, setSavingsGoals] = useState(initialSavingsGoals);
  const [portfolio, setPortfolio] = useState(initialPortfolio);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isRequestMoneyOpen, setIsRequestMoneyOpen] = useState(false);
  const [isPayBillsOpen, setIsPayBillsOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeGoalModal, setActiveGoalModal] = useState(null);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Notifications center
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Dividend Received',
      desc: '₹14,600 received from Tata Tech ETF.',
      time: '12m ago',
      read: false,
      type: 'income'
    },
    {
      id: 2,
      title: 'Security Notice',
      desc: 'New login detected from Quantum Workstation (Bangalore).',
      time: '2h ago',
      read: false,
      type: 'security'
    },
    {
      id: 3,
      title: 'AI Smart Tip',
      desc: 'You can allocate ₹1.5L into arbitrage yield for +9.2% APY.',
      time: '5h ago',
      read: true,
      type: 'insight'
    }
  ]);

  const markNotificationRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Financial Actions
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#6366F1', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // safe fallback
    }
  };

  const sendMoney = ({ recipient, amount, note, paymentMethod }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Invalid Amount', 'Please specify a positive transfer amount.', 'error');
      return false;
    }
    if (numAmount > availableBalance) {
      showToast('Insufficient Balance', 'You do not have enough available balance for this transfer.', 'error');
      return false;
    }

    setAvailableBalance(prev => prev - numAmount);

    const newTx = {
      id: 'tx-' + Date.now(),
      name: `Transfer to ${recipient}`,
      merchant: recipient,
      category: 'Transfer',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: paymentMethod || 'Instant UPI / IMPS',
      amount: -numAmount,
      status: 'Completed',
      avatar: '💸',
      refId: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000)
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('Transfer Successful', `₹${numAmount.toLocaleString('en-IN')} sent to ${recipient}`, 'success');
    triggerConfetti();
    return true;
  };

  const addMoney = ({ amount, source }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Invalid Amount', 'Please specify a valid top-up amount.', 'error');
      return false;
    }

    setAvailableBalance(prev => prev + numAmount);

    const newTx = {
      id: 'tx-' + Date.now(),
      name: `Top Up via ${source}`,
      merchant: source,
      category: 'Income',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: source,
      amount: numAmount,
      status: 'Completed',
      avatar: '🏦',
      refId: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000)
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('Funds Deposited', `₹${numAmount.toLocaleString('en-IN')} added to your wallet`, 'success');
    triggerConfetti();
    return true;
  };

  const payBill = ({ biller, amount, category }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Invalid Amount', 'Please specify a valid payment amount.', 'error');
      return false;
    }
    if (numAmount > availableBalance) {
      showToast('Insufficient Balance', 'Available balance is lower than the bill amount.', 'error');
      return false;
    }

    setAvailableBalance(prev => prev - numAmount);

    const newTx = {
      id: 'tx-' + Date.now(),
      name: `Bill Paid: ${biller}`,
      merchant: biller,
      category: category || 'Bills & Utilities',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: 'Platinum Metal Card (••9021)',
      amount: -numAmount,
      status: 'Completed',
      avatar: '⚡',
      refId: 'TXN-' + Math.floor(100000000 + Math.random() * 900000000)
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('Bill Settled', `₹${numAmount.toLocaleString('en-IN')} paid to ${biller}`, 'success');
    return true;
  };

  const depositToGoal = (goalId, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Invalid Amount', 'Please specify a valid deposit amount.', 'error');
      return false;
    }
    if (numAmount > availableBalance) {
      showToast('Insufficient Balance', 'Not enough funds in available balance.', 'error');
      return false;
    }

    setAvailableBalance(prev => prev - numAmount);
    setSavingsGoals(prev =>
      prev.map(goal => {
        if (goal.id === goalId) {
          const updated = goal.currentAmount + numAmount;
          return {
            ...goal,
            currentAmount: updated,
            history: [
              ...(goal.history || []),
              { date: 'Today', amount: numAmount }
            ]
          };
        }
        return goal;
      })
    );

    showToast('Goal Boosted', `₹${numAmount.toLocaleString('en-IN')} allocated to goal!`, 'success');
    triggerConfetti();
    return true;
  };

  const toggleCardStatus = (cardId) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          const nextStatus = card.status === 'Active' ? 'Frozen' : 'Active';
          showToast(
            nextStatus === 'Active' ? 'Card Unfrozen' : 'Card Locked',
            `${card.name} is now ${nextStatus.toLowerCase()}.`,
            nextStatus === 'Active' ? 'success' : 'warning'
          );
          return { ...card, status: nextStatus };
        }
        return card;
      })
    );
  };

  const updateCardLimit = (cardId, limit) => {
    setCards(prev =>
      prev.map(card => (card.id === cardId ? { ...card, dailyLimit: limit } : card))
    );
    showToast('Spending Limit Updated', `Daily limit set to ₹${limit.toLocaleString('en-IN')}`, 'info');
  };

  const toggleCardFeature = (cardId, featureKey) => {
    setCards(prev =>
      prev.map(card => {
        if (card.id === cardId) {
          const current = card[featureKey];
          return { ...card, [featureKey]: !current };
        }
        return card;
      })
    );
  };

  // Currency Formatter
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <BankingContext.Provider
      value={{
        theme,
        toggleTheme,
        user,
        setUser,
        totalBalance,
        availableBalance,
        investedAmount,
        monthlyChange,
        transactions,
        setTransactions,
        cards,
        savingsGoals,
        portfolio,
        setPortfolio,
        activeTab,
        setActiveTab,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        // Modals
        isSendMoneyOpen,
        setIsSendMoneyOpen,
        isRequestMoneyOpen,
        setIsRequestMoneyOpen,
        isPayBillsOpen,
        setIsPayBillsOpen,
        isAddMoneyOpen,
        setIsAddMoneyOpen,
        isSearchOpen,
        setIsSearchOpen,
        activeGoalModal,
        setActiveGoalModal,
        // Actions
        sendMoney,
        addMoney,
        payBill,
        depositToGoal,
        toggleCardStatus,
        updateCardLimit,
        toggleCardFeature,
        formatINR,
        toasts,
        showToast,
        dismissToast,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};
