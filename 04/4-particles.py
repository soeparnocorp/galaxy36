# 4-particles.py — particle generator (server-side/script) 
# This file demonstrates a simple particle dump generator for art exports.
# It won't run in browser — it's included so GitHub counts Python.
import json
import math
import random

def generate(n, w=1600, h=900):
    out=[]
    for i in range(n):
        out.append({
            "x": random.random()*w,
            "y": random.random()*h,
            "r": random.random()*1.8 + 0.3,
            "vx": (random.random()-0.5)*0.6,
            "vy": (random.random()-0.5)*0.6,
            "a": round(random.random()*0.9+0.05, 3)
        })
    return out

if __name__=="__main__":
    particles = generate(1200)
    print(json.dumps({"particles":particles}))
