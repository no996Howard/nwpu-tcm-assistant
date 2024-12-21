document.querySelector('.toggle-btn').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('hidden');
});
// 页面切换逻辑
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        // 移除所有激活状态
        document.querySelectorAll('.nav-links a').forEach(l => 
            l.classList.remove('active'));
        document.querySelectorAll('.page-section').forEach(section => 
            section.classList.remove('active'));

        // 添加新的激活状态
        this.classList.add('active');
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    });
});

// 药材数据
const herbData = {
    "人参": {
        description: "人参，五加科植物，被誉为'百草之王'，具有大补元气、复脉固脱等功效。",
        image: "/static/images/herbs/人参.jpg"
    },
    "黄芪": {
        description: "黄芪，豆科植物，有增强免疫力、利尿消肿等作用。",
        image: "/static/images/herbs/黄芪.jpg"
    },
    "当归": {
        description: "当归，伞形科植物，用于补血活血、调经止痛。",
        image: "/static/images/herbs/当归.jpg"
    },
    "党参": {
        description: "党参, 人参科植物，有补中益气、健脾益肺等功效。",
        image: "/static/images/herbs/党参.jpg"
    },
    "半夏": {
        description: "半夏, 天南星科植物，有燥湿化痰、降逆止呕等功效。",
        image: "/static/images/herbs/半夏.jpg"
    },
    "鱼胆草": {
        description: "鱼胆草, 龙胆科植物，有清热泻火、解毒利湿等功效。",
        image: "/static/images/herbs/鱼胆草.jpg"
    },
    "路路通": {
        description: "路路通, 金缕梅科植物，有祛风活络、利水通经等功效。",
        image: "/static/images/herbs/路路通.jpg"
    },
    "胆木": {
        description: "胆木, 茜草科植物，有清热解毒、消肿止痛等功效。",
        image: "/static/images/herbs/胆木.jpg"
    },
    "山姜": {
        description: "山姜, 姜科植物，有温中散寒、祛风活血等功效。",
        image: "/static/images/herbs/山姜.jpg"
    },
    "藤黄": {
        description: "藤黄, 藤黄科植物，有消肿排脓、散瘀解毒等功效。",
        image: "/static/images/herbs/藤黄.jpg"
    },
    "肉豆蔻": {
        description: "肉豆蔻, 肉豆蔻科植物，有温中行气、涩肠止泻等功效。",
        image: "/static/images/herbs/肉豆蔻.jpg"
    },
    "山萸肉": {
        description: "山萸肉, 山茱萸科植物，有补益肝肾、涩精固脱等功效。",
        image: "/static/images/herbs/山萸肉.jpg"
    },
    "萝藦": {
        description: "萝藦, 萝藦科植物，有补精益气、通乳解毒等功效。",
        image: "/static/images/herbs/萝藦.jpg"
    },
    "乌桕子": {
        description: "乌桕子, 大戟科植物，有杀虫、利水通便等功效。",
        image: "/static/images/herbs/乌桕子.jpg"
    },
    "一点红": {
        description: "一点红, 菊科植物，有清热解毒、消炎利尿等功效。",
        image: "/static/images/herbs/一点红.jpg"
    },
    "醉鱼草": {
        description: "醉鱼草, 马钱科植物，有止咳定喘、活血祛瘀等功效。",
        image: "/static/images/herbs/醉鱼草.jpg"
    },
    "铁苋": {
        description: "铁苋, 大戟科植物，有清热利湿、凉血解毒等功效。",
        image: "/static/images/herbs/铁苋.jpg"
    },
    "八角莲": {
        description: "八角莲, 小檗科植物，有化痰散结、祛瘀止痛等功效。",
        image: "/static/images/herbs/八角莲.jpg"
    },
    "海马": {
        description: "海马, 海龙科动物，有温肾壮阳、散结消肿等功效。",
        image: "/static/images/herbs/海马.jpg"
    },
    "九节菖蒲": {
        description: "九节菖蒲, 毛莨科植物，有开窍化痰、醒脾安神等功效。",
        image: "/static/images/herbs/九节菖蒲.jpg"
    },
    "防风草": {
        description: "防风草, 唇形科植物，有祛风除湿、解毒止痛等功效。",
        image: "/static/images/herbs/防风草.jpg"
    },
    "豆蔻": {
        description: "豆蔻, 姜科植物，有化湿消痞、行气温中等功效。",
        image: "/static/images/herbs/豆蔻.jpg"
    }
};
    // 可以继续添加更多药材数据...


// 药材选择处理
document.getElementById('herbSelect')?.addEventListener('change', function(e) {
    const selectedHerb = e.target.value;
    const herbInfo = document.getElementById('herbInfo');
    
    if (selectedHerb && herbData[selectedHerb]) {
        const herb = herbData[selectedHerb];
        document.getElementById('herbName').textContent = selectedHerb;
        document.getElementById('herbImage').src = herb.image;
        document.getElementById('herbDescription').textContent = herb.description;
        herbInfo.style.display = 'block';
    } else {
        herbInfo.style.display = 'none';
    }
});

// 猜猜乐游戏功能
let currentHerb = null;

document.getElementById('startGame')?.addEventListener('click', function() {
    startNewGame();
});

function startNewGame() {
    const herbs = Object.keys(herbData);
    currentHerb = herbs[Math.floor(Math.random() * herbs.length)];
    document.getElementById('questionImage').src = herbData[currentHerb].image;
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('gameResult').textContent = '';
    document.getElementById('playAgain').style.display = 'none';
    document.getElementById('userGuess').value = '';
}

document.querySelector('.guess-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const guess = document.getElementById('userGuess').value.trim();
    if (guess === currentHerb) {
        document.getElementById('gameResult').textContent = '恭喜你，答对了！';
    } else {
        document.getElementById('gameResult').textContent = `很遗憾，答错了。正确答案是：${currentHerb}`;
    }
    document.getElementById('playAgain').style.display = 'block';
});

document.getElementById('playAgain')?.addEventListener('click', startNewGame);

// 拜师部分的聊天功能
// API调用相关的JavaScript代码
const BACKEND_URL = 'http://localhost:5000/api/chat';

async function callBackendAPI(message) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling backend:', error);
        // 如果API调用失败，使用备选响应
        return herbResponses[message] || 
            `抱歉，我暂时无法访问完整的药材信息。不过我知道${message}是一味重要的中药材...`;
    }
}

// 发送消息函数
// 新代码
async function sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();
        const loading = document.getElementById('loading');
        
        // 重置loading的显示状态
        loading.style.display = 'none';
        
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            input.value = '';

            // 显示加载动画
            loading.style.display = 'flex';

            try {
                // 发送请求到后端
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // 创建一个新的消息div用于累积响应内容
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message assistant-message';
                document.getElementById('chatMessages').appendChild(messageDiv);

                // 设置响应流读取
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullText = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        // 完成时隐藏加载动画
                        loading.style.display = 'none';
                        break;
                    }

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.error) {
                                    console.error('Error:', data.error);
                                    messageDiv.textContent = '抱歉，处理您的请求时出现错误。';
                                    loading.style.display = 'none';
                                } else if (data.content) {
                                    if (data.replace) {
                                        fullText = data.content;
                                    } else {
                                        fullText += data.content;
                                    }
                                    messageDiv.innerHTML = fullText.split('\n').map(line => 
                                        line.trim() ? `<p>${line}</p>` : '<br>'
                                    ).join('');
                                    messageDiv.scrollIntoView({ behavior: 'smooth' });
                                    loading.style.display = 'none';
                                }
                            } catch (e) {
                                console.error('Parse error:', e);
                                loading.style.display = 'none';
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                loading.style.display = 'none';
                addMessage('抱歉，我现在无法回答您的问题。请稍后再试。', 'assistant');
            }
        }
    else {
        // 隐藏加载动画
        document.getElementById('loading').style.display = 'none';
    }
}
// 更新chat-input监听器
document.getElementById('userInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function addMessage(text, type) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle Enter key in chat input
document.getElementById('userInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 药食同源部分的菜谱功能
const recipeData = {
    "当归炖鸡": {
        effect: "当归炖鸡具有补血调经的功效。",
        image: "/nwpu-tcm-assistant/backend/img/ys1.png",
        steps: [
            "将当归洗净备用",
            "鸡切块，焯水去血沫",
            "将当归和鸡块一同炖煮2小时"
        ]
    },
    "黄芪炖羊肉": {
        effect: "黄芪炖羊肉具有温阳补气的功效。",
        image: "/nwpu-tcm-assistant/backend/img/ys2.png",
        steps: [
            "将黄芪洗净备用",
            "羊肉切块，焯水去血沫",
            "将黄芪和羊肉块一同炖煮2小时"
        ]
    },
    "枸杞红枣茶": {
        effect: "枸杞红枣茶具有滋补肝肾、益精明目的功效。",
        image: "/nwp-tcm-assistant/backend/img/ys3.png",
        steps: [
            "将枸杞和红枣洗净",
            "加入适量水煮沸后小火煮10分钟",
            "可加入适量冰糖调味"
        ]
    },
    "山药炒木耳": {
        effect: "山药炒木耳具有健脾益肺、补肾涩精的功效。",
        image: "/nwpu-tcm-assistant/backend/img/ys4.png",
        steps: [
            "山药切片，木耳泡发",
            "将山药和木耳一同炒至熟透",
            "加入适量盐和调味料"
        ]
    }
};

document.getElementById('recipeSelect')?.addEventListener('change', function(e) {
    const selectedRecipe = e.target.value;
    const recipeDetails = document.getElementById('recipeDetails');
    
    if (selectedRecipe && recipeData[selectedRecipe]) {
        const recipe = recipeData[selectedRecipe];
        document.getElementById('recipeName').textContent = selectedRecipe;
        document.getElementById('recipeImage').src = recipe.image
        document.getElementById('recipeEffect').textContent = recipe.effect;
        document.getElementById('recipeImage').style.width = '60%';
        document.getElementById('recipeImage').style.height = 'auto';
        const stepsList = document.getElementById('recipeSteps');
        stepsList.innerHTML = '';
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
        
        recipeDetails.style.display = 'block';
    } else {
        recipeDetails.style.display = 'none';
    }
}

);