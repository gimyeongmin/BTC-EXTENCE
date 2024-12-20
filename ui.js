// UI.js
class BlockchainWallet {
    constructor() {
        // 초기 상태 설정
        this.state = {
            node1: {
                address: 'WALLET-1', 
                balance: 1000.00000000,
                sent: 0,
                received: 0,
                isOnline: true
            },
            node2: {
                address: 'WALLET-2',
                balance: 1000.00000000, 
                sent: 0,
                received: 0,
                isOnline: true
            },
            transactions: [],
            webSockets: {
                node1: null,
                node2: null
            }
        };

        this.initialize();
    }

    initialize() {
        this.connectWebSocket();
        this.setupEventListeners();
        this.updateUI();
        this.startNetworkMonitoring();
    }

    connectWebSocket() {
        const ws = new WebSocket(`ws://${window.location.hostname}:6000`);

        ws.onopen = () => {
            console.log('WebSocket 연결됨');
            this.updateConnectionStatus(true);
        };

        ws.onclose = () => {
            console.log('WebSocket 연결 끊김');
            this.updateConnectionStatus(false);
            // 5초 후 재연결 시도
            setTimeout(() => this.connectWebSocket(), 5000);
        };

        ws.onmessage = (event) => {
            this.handleWebSocketMessage(event.data);
        };

        this.ws = ws;
    }

    setupEventListeners() {
        // 거래 폼 제출
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransactionSubmit(e.target);
        });

        // 송신자 선택 변경
        document.getElementById('senderSelect').addEventListener('change', (e) => {
            const recipientSelect = document.getElementById('recipientSelect');
            recipientSelect.value = e.target.value === 'node1' ? 'node2' : 'node1';
        });
    }

    updateConnectionStatus(isConnected) {
        ['node1', 'node2'].forEach(nodeId => {
            const statusElement = document.getElementById(`${nodeId}Status`);
            const nodeElement = document.getElementById(nodeId);

            if (isConnected) {
                statusElement.textContent = '연결됨';
                statusElement.className = 'mt-2 text-sm font-medium text-green-600';
                nodeElement.classList.add('network-active');
            } else {
                statusElement.textContent = '연결 끊김';
                statusElement.className = 'mt-2 text-sm font-medium text-red-600';
                nodeElement.classList.remove('network-active');
            }
        });
    }

    async handleTransactionSubmit(form) {
        try {
            const formData = {
                sender: form.sender.value,
                recipient: form.recipient.value,
                amount: parseFloat(form.amount.value),
                senderEmail: form.senderEmail.value,
                recipientEmail: form.recipientEmail.value,
                id: `TX-${Date.now()}`
            };

            if (!this.validateTransaction(formData)) {
                return;
            }

            const response = await fetch('/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                this.processTransaction(formData);
                form.reset();
                this.showToast('거래가 성공적으로 전송되었습니다');
            } else {
                this.showToast(result.error || '거래 처리 중 오류가 발생했습니다', 'error');
            }
        } catch (error) {
            console.error('Transaction error:', error);
            this.showToast('거래 처리 중 오류가 발생했습니다', 'error');
        }
    }

    validateTransaction(data) {
        if (data.sender === data.recipient) {
            this.showToast('송신자와 수신자가 같을 수 없습니다', 'error');
            return false;
        }

        if (!this.validateEmail(data.senderEmail) || !this.validateEmail(data.recipientEmail)) {
            this.showToast('유효한 이메일 주소를 입력하세요', 'error');
            return false;
        }

        const senderNode = this.state[data.sender];
        if (data.amount <= 0 || data.amount > senderNode.balance) {
            this.showToast('유효하지 않은 금액입니다', 'error');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    processTransaction(transaction) {
        this.state.transactions.unshift(transaction);
        
        // 잔액 업데이트
        if (transaction.sender === this.state.node1.address) {
            this.state.node1.sent += transaction.amount;
            this.state.node1.balance -= transaction.amount;
            this.state.node2.received += transaction.amount;
            this.state.node2.balance += transaction.amount;
        } else {
            this.state.node2.sent += transaction.amount;
            this.state.node2.balance -= transaction.amount;
            this.state.node1.received += transaction.amount;
            this.state.node1.balance += transaction.amount;
        }

        this.updateUI();
        this.addTransactionToHistory(transaction);
    }

    handleWebSocketMessage(data) {
        try {
            const message = JSON.parse(data);
            if (message.type === 'TRANSACTION') {
                this.processTransaction(message.transaction);
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    }

    updateUI() {
        this.updateBalances();
        this.updateTransactionHistory();
    }

    updateBalances() {
        // 노드 1 업데이트
        document.getElementById('balance1').textContent = this.state.node1.balance.toFixed(8);
        document.getElementById('node1Sent').textContent = this.state.node1.sent.toFixed(8);
        document.getElementById('node1Received').textContent = this.state.node1.received.toFixed(8);
        document.getElementById('node1TotalBalance').textContent = this.state.node1.balance.toFixed(8) + ' BTC';

        // 노드 2 업데이트
        document.getElementById('balance2').textContent = this.state.node2.balance.toFixed(8);
        document.getElementById('node2Sent').textContent = this.state.node2.sent.toFixed(8);
        document.getElementById('node2Received').textContent = this.state.node2.received.toFixed(8);
        document.getElementById('node2TotalBalance').textContent = this.state.node2.balance.toFixed(8) + ' BTC';
    }

    addTransactionToHistory(transaction) {
        const historyElement = document.getElementById('transactionHistory');
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-animation border-b border-gray-200 pb-3';
        
        transactionElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-sm font-medium text-gray-900">송신자: ${transaction.sender}</p>
                    <p class="text-sm font-medium text-gray-900">수신자: ${transaction.recipient}</p>
                    <p class="text-xs text-gray-500">거래 ID: ${transaction.id}</p>
                    <p class="text-xs text-gray-500">시간: ${new Date().toLocaleString()}</p>
                </div>
                <p class="text-sm font-semibold text-blue-600">${transaction.amount.toFixed(8)} BTC</p>
            </div>
        `;

        historyElement.insertBefore(transactionElement, historyElement.firstChild);
        this.updateTotalAmount();
    }

    updateTotalAmount() {
        const total = this.state.transactions.reduce((sum, tx) => sum + tx.amount, 0);
        document.getElementById('totalTransactionAmount').textContent = total.toFixed(8);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    startNetworkMonitoring() {
        setInterval(() => {
            this.updateNetworkStatus();
        }, 5000);
    }

    updateNetworkStatus() {
        const latency1 = Math.floor(Math.random() * 50) + 10;
        const latency2 = Math.floor(Math.random() * 50) + 10;

        document.getElementById('node1Latency').textContent = `${latency1}ms`;
        document.getElementById('node2Latency').textContent = `${latency2}ms`;
    }
}

// 앱 초기화
window.addEventListener('load', () => {
    window.wallet = new BlockchainWallet();
});
