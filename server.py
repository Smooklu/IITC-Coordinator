from flask import Flask, request, jsonify, Response
import json
from flask_cors import CORS, cross_origin
import time

app = Flask(__name__)
CORS(app)

auth_dict = json.load(open('auth_keys.json'))
players_dict = {}

# function to return key for any value
def get_key(val):
    for key, value in auth_dict.items():
         if val == value:
             return key
 
    return "key doesn't exist"

@app.route("/heartbeat", methods=['POST'])
@cross_origin()
def home():
    auth = request.headers.get('authorization')
    if not (auth in auth_dict.values()):
        return {
            "error": "Unauthorized",
        }, 401

    content = request.json
    content['dt'] = time.time()
    player_name = get_key(auth)
    players_dict.update({player_name: content})
    print(players_dict)
    return {"status": 200}, 200

@app.route("/get_players", methods=['OPTIONS', 'GET'])
@cross_origin()
def json_list():
    auth = request.headers.get('authorization')
    if not (auth in auth_dict.values()):
        return {
            "error": "Unauthorized",
        }, 401

    player_name = get_key(auth)
    p_temp = {}
    for k, v in players_dict.items():
        p_temp.update({k: v})
    p_temp.pop(player_name)
    resp = Response(json.dumps(p_temp))
    return resp

@app.after_request
def apply_caching(response):
    response.headers['Access-Control-Allow-Private-Network'] = 'true'
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")