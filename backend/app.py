from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS
from zhipuai import ZhipuAI
from dotenv import load_dotenv
import os
import logging
import json
import re
import base64
import requests
import pyttsx3

# 加载环境变量
load_dotenv()

# 静态文件夹设置
current_dir = os.path.dirname(os.path.abspath(__file__))
static_folder = os.path.join(current_dir, 'static')

# Flask 应用初始化
app = Flask(__name__, static_folder=static_folder, static_url_path='/static')
CORS(app)

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)    

# 初始化 ZhipuAI 客户端
client = ZhipuAI(api_key="5c4b3cc18b174a36c0e55e8d2c5a2a9a.fdgOoSvK7xsLpcKo")

@app.route('/static/images/<path:filename>')
def serve_image(filename):
    image_path = os.path.join(static_folder, 'images', filename)
    if not os.path.exists(image_path):
        logger.warning(f"Image not found: {filename}")
        return send_from_directory(static_folder, 'placeholder.jpg'), 404  # 返回占位图
    return send_from_directory(os.path.join(static_folder, 'images'), filename)

def format_response_text(text):
    """格式化响应文本，使段落更清晰"""
    # 替换多个换行为一个换行
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\*\*', '', text)
    # 删除标题标记 ###
    text = re.sub(r'^###\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'^-\s*', '', text, flags=re.MULTILINE)
    # 删除列表标记（数字和点）
    text = re.sub(r'^\d+\.\s*', '', text, flags=re.MULTILINE)
     # 删除空行
    text = re.sub(r'\n\s*\n', '\n', text)
    # 删除行首和行尾的空白字符
    text = re.sub(r'^\s+|\s+$', '', text, flags=re.MULTILINE)
    return re.sub(r'(\S[。：！？]+)\n+(["""])\n', r'\1\2\n', text)
    
    #异步通信模块
    
    # 给序号前添加换行
    #text = re.sub(r'([^。\n])(\d+[\.、])', r'\1\n\n\2', text)
    # 在冒号后添加换行
    #text = re.sub(r'：([^\n])', r'：\n\1', text)
    # 处理功效等关键词
    #keywords = ['功效', '特点', '使用方法', '注意事项', '禁忌']
    #for keyword in keywords:
    #text = re.sub(f'({keyword}[：:])', r'\n\n\1', text)
    # 确保开头没有多余的换行
    #text = text.strip()
    # 在句号后添加适当的换行，但避免破坏已有的格式
    #text = re.sub(r'。(?!\n)(?!\d)', '。\n', text)
    #return text
    
#聊天模块
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # 获取前端发送的数据
        data = request.json
        message = data.get('message', '')

        # 调用模型API
        response = client.chat.completions.create(
            model="GLM-4-Plus",  # 使用最新的模型
            messages=[
                {
                    "role": "system",
                    "content": "你是中医药专家李时珍，以简要，专业且通俗易懂的方式解答关于中医药的问题。"
                                "你的回答需要简要，分段清晰，每个功效单独成段，使用序号列举。"
                                "最后要简要添加使用方法和注意事项。"
                                "在回答的一开始需要加入《本草纲目》中对于其的描述的文字,用引号引用，且结尾不要句号，如果《本草纲目》中没有这味中药，请说明。"
                                "如果问题明显有恶趣味，请阻止并劝解。"
                },
                {
                    "role": "user",
                    "content": f"请简要介绍{message}这味中药的'功效', '特点', '使用方法', '注意事项', '禁忌'。要求语言通俗易懂。"
                }
            ],
            temperature=0.7,
            top_p=0.9,
            stream=True
        )

        def generate():
            try:
                full_text = ""
                for chunk in response:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        full_text += content
                        # 如果遇到段落结束符号，格式化并发送当前累积的文本
                        if re.search(r'[。！？\n]', content):
                            formatted_text = format_response_text(full_text)
                            yield f"data: {json.dumps({'content': formatted_text, 'replace': True})}\n\n"
                text_to_speech(formatted_text)  # 调用语音播报函数

                # 最后发送完整的格式化文本
                final_text = format_response_text(full_text)
                yield f"data: {json.dumps({'content': final_text, 'replace': True, 'finished': True})}\n\n"
                    
            except Exception as e:
                logger.error(f"Error in generate: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        return Response(generate(), mimetype='text/event-stream')

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "message": str(e)
        }), 500
        
#图片识别模块        
@app.route('/api/plant_identify', methods=['POST'])
def plant_identify():
    uploaded_file = request.files['image']
    if uploaded_file:
        encoded_string = base64.b64encode(uploaded_file.read()).decode()
        data = {'image': encoded_string, 'baike_num': 1}
        access_token = get_access_token()
        if access_token:
            headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            url = f'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token={access_token}'  # 修复URL

            def text_to_speech(text):
                engine = pyttsx3.init()
                engine.setProperty('rate', 150)  # 语速，值越大越快
                engine.setProperty('volume', 0.9)  # 音量，0~1之间
                engine.say(text)
                engine.runAndWait()

            # 发送POST请求
            response = requests.post(url, headers=headers, data=data)
            if response.status_code == 200:
                result = response.json()
                if 'result' in result and result['result']:
                    top_result = max(result['result'], key=lambda x: x['score'])
                    text_to_speech("识别结果：" + top_result['name'])  # 调用语音播报函数
                    text_to_speech(f"置信度：{top_result['score']}")  # 播置信度
                    description = top_result.get('baike_info', {}).get('description', "暂无描述信息。")
                    text_to_speech(description)  # 调用语音播报函数
                    
                    return jsonify({
                        "name": top_result['name'],
                        "confidence": top_result['score'],
                        "description": description
                    })
                else:
                    error_message = "没有识别结果。"
                    text_to_speech(error_message)  # 调用语音播报函数
                    return jsonify({"error": error_message})
            else:
                error_message = f"请求失败，状态码：{response.status_code}"
                text_to_speech(error_message)  # 调用语音播报函数
                return jsonify({"error": error_message})
        else:
            error_message = "获取 access_token 失败，请检查 AK 和 SK 是否正确。"
            text_to_speech(error_message)
            return jsonify({"error": error_message})
    else:
        error_message = "请上传一张图片。"
        text_to_speech(error_message)
        return jsonify({"error": error_message})
    
def text_to_speech(text):
    engine = pyttsx3.init()
    engine.setProperty('rate', 225)  # 语速，值越大越快
    engine.setProperty('volume', 0.9)  # 音量，0~1之间
    engine.say(text)
    engine.runAndWait()  
def get_access_token():
            host = 'https://aip.baidubce.com/oauth/2.0/token'
            params = {
                'grant_type': 'client_credentials',
                'client_id': '5sYiWNWSHg3KS6Mqa4eQvMQe',
                'client_secret': '40314FfsgaLbUyo8uKlOrp0tL06HXmaJ'
            }
            response = requests.get(host, params=params)
            if response:
                return response.json()['access_token']
            return None

#/health 路由
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# 首页路由
@app.route('/')
def index():
    return app.send_static_file('index.html')

# 获取模型列表
if __name__ == '__main__':    
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)
   