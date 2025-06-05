// Village data JSON
const villageData = {
  title: "Village Leader",
  name: "Matt",
  description: "Oversees the entire village and makes key decisions.",
  icon: "👤",
  children: [
    {
      title: "Village Elder",
      name: "Mike",
      description: "Senior advisor to the village leader.",
      icon: "👴",
      children: [
        {
          title: "Veteran",
          name: "Jake",
          description: "Experienced warrior and mentor.",
          icon: "🛡️",
          children: []
        },
        {
          title: "Elder",
          name: "Marcy",
          description: "Wise elder overseeing traditions.",
          icon: "🧓",
          children: []
        },
        {
          title: "Healer",
          name: "Lina",
          description: "Cares for the sick and wounded.",
          icon: "💊",
          children: [
            {
              title: "Apprentice Healer",
              name: "Nina",
              description: "Learning the healing arts from Lina.",
              icon: "🧪",
              children: []
            },
            {
              title: "Herbalist",
              name: "Tara",
              description: "Prepares herbal remedies.",
              icon: "🌿",
              children: []
            }
          ]
        }
      ]
    },
    {
      title: "Village Elder",
      name: "Mark",
      description: "In charge of village resources.",
      icon: "👴",
      children: [
        {
          title: "Gatherer",
          name: "Jared",
          description: "Collects resources and food.",
          icon: "🪓",
          children: []
        },
        {
          title: "Builder",
          name: "Jill",
          description: "Constructs and repairs buildings.",
          icon: "🏗️",
          children: []
        },
        {
          title: "Carpenter",
          name: "Sven",
          description: "Crafts wooden tools and furniture.",
          icon: "🪚",
          children: []
        }
      ]
    },
    {
      title: "Village Elder",
      name: "Selena",
      description: "Responsible for village defense.",
      icon: "👴",
      children: [
        {
          title: "Archer",
          name: "Elena",
          description: "Defends the village from afar.",
          icon: "🏹",
          children: []
        },
        {
          title: "Scout",
          name: "Tom",
          description: "Gathers information about surroundings.",
          icon: "🕵️",
          children: []
        },
        {
          title: "Guard",
          name: "Ralph",
          description: "Protects the village gates.",
          icon: "🛡️",
          children: []
        }
      ]
    },
    {
      title: "Village Elder",
      name: "Tanya",
      description: "Oversees farming and food production.",
      icon: "👴",
      children: [
        {
          title: "Farmer",
          name: "Olivia",
          description: "Cultivates crops and manages livestock.",
          icon: "🌾",
          children: []
        },
        {
          title: "Fisherman",
          name: "Pete",
          description: "Provides fish and aquatic resources.",
          icon: "🎣",
          children: []
        }
      ]
    }
  ]
};

// Chat app code
let channels = JSON.parse(localStorage.getItem('channels')) || ['general', 'off-topic', 'announcements'];
let currentChannel = localStorage.getItem('currentChannel') || 'general';
let messages = JSON.parse(localStorage.getItem('messages')) || {};
channels.forEach(channel => {
  if (!messages[channel]) messages[channel] = [];
});

function saveMessages() {
  localStorage.setItem('messages', JSON.stringify(messages));
}

function saveChannels() {
  localStorage.setItem('channels', JSON.stringify(channels));
}

function renderChannels() {
  const channelList = document.getElementById('channelList');
  channelList.innerHTML = '';
  channels.forEach(channel => {
    const li = document.createElement('li');
    li.textContent = '#' + channel;
    if (channel === currentChannel) li.classList.add('active');
    li.onclick = () => {
      currentChannel = channel;
      localStorage.setItem('currentChannel', currentChannel);
      renderChannels();
      renderMessages();
    };
    channelList.appendChild(li);
  });
}

function renderMessages() {
  const chatBox = document.getElementById('chatBox');
  chatBox.innerHTML = '';
  messages[currentChannel].forEach(msg => {
    const div = document.createElement('div');
    div.textContent = msg;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Voting code
const votes = JSON.parse(localStorage.getItem('votes') || '[]');

function saveVotes() {
  localStorage.setItem('votes', JSON.stringify(votes));
}

function addVoteItem() {
  const question = document.getElementById('vote-question').value.trim();
  const option1 = document.getElementById('vote-option1').value.trim();
  const option2 = document.getElementById('vote-option2').value.trim();
  const deadlineInput = document.getElementById('vote-deadline').value;
  if (!question || !option1 || !option2 || !deadlineInput) {
    alert('Please fill all fields.');
    return;
  }
  // Set the time to midnight (00:00:00) on the selected date
  const deadline = new Date(deadlineInput + 'T00:00:00').getTime();
  const newVote = {
    question,
    options: [option1, option2],
    votes: [0, 0],
    comments: [],
    deadline
  };
  votes.push(newVote);
  saveVotes();
  renderVoteItems();
}

function formatTimeLeft(timeLeft) {
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function renderVoteItems() {
  const container = document.getElementById('vote-items');
  container.innerHTML = '';
  votes.forEach((vote, index) => {
    const now = Date.now();
    const expired = now > vote.deadline;
    const timeLeft = Math.max(0, vote.deadline - now);
    const timeLeftFormatted = formatTimeLeft(timeLeft);

    const div = document.createElement('div');
    div.className = 'vote-item';
    div.innerHTML = `<p><strong>${vote.question}</strong></p>
      ${vote.options.map((opt, i) => `
        <button ${expired ? 'disabled' : ''} onclick="castVote(${index}, ${i})">
          ${opt} (${vote.votes[i]})
        </button>`).join('')}
      <p>${expired ? 'Voting closed' : `Time left: ${timeLeftFormatted}`}</p>
      <details>
        <summary>💬 Comments (${vote.comments.length})</summary>
        <div class="vote-comments">
          ${vote.comments.map(c => `<div>${c}</div>`).join('')}
          <input type="text" placeholder="Add a comment" onkeypress="if(event.key==='Enter') addComment(${index}, this)" />
        </div>
      </details>`;
    container.appendChild(div);
  });
}

function castVote(index, optionIndex) {
  votes[index].votes[optionIndex]++;
  saveVotes();
  renderVoteItems();
}

function addComment(index, input) {
  const comment = input.value.trim();
  if (!comment) return;
  votes[index].comments.push(comment);
  input.value = '';
  saveVotes();
  renderVoteItems();
}

// Village Hierarchy code
function createVillageNode(data) {
  const li = document.createElement('li');
  li.classList.add('node');
  if (data.title === "Village Leader") li.classList.add('leader');
  else if (data.title === "Village Elder") li.classList.add('elder');
  else li.classList.add('role');

  const collapseIndicator = document.createElement('span');
  collapseIndicator.className = 'collapse-indicator';
  collapseIndicator.textContent = data.children && data.children.length ? '▼' : '';
  li.appendChild(collapseIndicator);

  const label = document.createElement('span');
  label.textContent = `${data.icon} ${data.title}: ${data.name}`;
  li.appendChild(label);

  li.title = data.description;

  if (data.children && data.children.length) {
    const ul = document.createElement('ul');
    data.children.forEach(child => {
      ul.appendChild(createVillageNode(child));
    });
    li.appendChild(ul);
  }

  li.addEventListener('click', e => {
    e.stopPropagation();
    if (!li.classList.contains('collapsed')) {
      li.classList.add('collapsed');
      collapseIndicator.textContent = '▶';
    } else {
      li.classList.remove('collapsed');
      collapseIndicator.textContent = '▼';
    }
  });

  return li;
}

function renderVillageTree() {
  const container = document.getElementById('villageTree');
  container.innerHTML = '';
  container.appendChild(createVillageNode(villageData));
}

// Wallet connection code
const connectWalletButton = document.getElementById("connect-wallet-button");
const disconnectWalletButton = document.getElementById("disconnect-wallet-button");
const walletInfo = document.getElementById("wallet-info");
const networkName = document.getElementById("network-name");
const ethBalance = document.getElementById("eth-balance");

async function getNetworkName(chainId) {
  const networks = {
    '0x1': 'Ethereum Mainnet',
    '0x3': 'Ropsten Testnet',
    '0x4': 'Rinkeby Testnet',
    '0x5': 'Goerli Testnet',
    '0x2a': 'Kovan Testnet',
    '0x89': 'Polygon Mainnet',
    '0x13881': 'Mumbai Testnet'
  };
  return networks[chainId] || `Unknown Network (${chainId})`;
}

async function getEthBalance(provider, address) {
  const balance = await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"]
  });
  return (parseInt(balance, 16) / 1e18).toFixed(4);
}

async function connectWallet() {
  if (typeof window.ethereum !== "undefined" || (window.web3 && window.web3.currentProvider)) {
    try {
      const provider = window.ethereum || window.web3.currentProvider;

      try {
        await provider.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }]
        });
      } catch (e) {
        // Ignore errors if no permissions exist
      }

      await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      });

      const accounts = await provider.request({ 
        method: "eth_requestAccounts"
      });
      const account = accounts[0];

      const chainId = await provider.request({ method: "eth_chainId" });
      const network = await getNetworkName(chainId);
      
      const balance = await getEthBalance(provider, account);

      connectWalletButton.textContent = `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`;
      connectWalletButton.disabled = true;
      disconnectWalletButton.style.display = 'block';
      networkName.textContent = network;
      ethBalance.textContent = `${balance} ETH`;
      walletInfo.style.display = 'block';

      provider.on('chainChanged', async (chainId) => {
        const newNetwork = await getNetworkName(chainId);
        networkName.textContent = newNetwork;
        const newBalance = await getEthBalance(provider, account);
        ethBalance.textContent = `${newBalance} ETH`;
      });

      provider.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const newAccount = accounts[0];
          connectWalletButton.textContent = `Connected: ${newAccount.slice(0, 6)}...${newAccount.slice(-4)}`;
          const newBalance = await getEthBalance(provider, newAccount);
          ethBalance.textContent = `${newBalance} ETH`;
        }
      });

    } catch (err) {
      console.error("Connection error:", err);
      alert("Could not connect to MetaMask.");
    }
  } else {
    alert("MetaMask is not detected. Please ensure it is installed and refreshed.");
  }
}

async function disconnectWallet() {
  connectWalletButton.textContent = 'Connect to Wallet';
  connectWalletButton.disabled = false;
  disconnectWalletButton.style.display = 'none';
  walletInfo.style.display = 'none';
  networkName.textContent = '-';
  ethBalance.textContent = '-';

  if (window.ethereum) {
    window.ethereum.removeAllListeners('chainChanged');
    window.ethereum.removeAllListeners('accountsChanged');
    
    try {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }]
      });
    } catch (e) {
      // Ignore errors if no permissions exist
    }
  }
}

// Event Listeners
document.getElementById('addChannelBtn').onclick = () => {
  const input = document.getElementById('newChannelName');
  const name = input.value.trim();
  if (!name) return alert('Enter a channel name');
  if (channels.includes(name)) return alert('Channel already exists');
  channels.push(name);
  messages[name] = [];
  saveChannels();
  saveMessages();
  renderChannels();
  input.value = '';
};

document.getElementById('chatInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const input = e.target;
    const msg = input.value.trim();
    if (!msg) return;
    messages[currentChannel].push(msg);
    saveMessages();
    renderMessages();
    input.value = '';
  }
});

connectWalletButton.addEventListener("click", connectWallet);
disconnectWalletButton.addEventListener("click", disconnectWallet);

// Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
}

// Initialize
renderChannels();
renderMessages();
renderVoteItems();
renderVillageTree();

// MetaMask detection retry
window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof window.ethereum === "undefined") {
      console.warn("MetaMask not detected after delay.");
    }
  }, 500);
});