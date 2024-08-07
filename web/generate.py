import os
import json
import time
from PIL import Image

rooturl = "data"

styles = [
    "real", "fantacy"
]

sexs = [
    "man", "female", "girl", "boy"
]

indexs = {
    "man": {"real": [], "fantacy": []},
    "female": {"real": [], "fantacy": []},
    "girl": {"real": [], "fantacy": []},
    "boy": {"real": [], "fantacy": []},
}

import hashlib

def calculate_sha256(string):
    # 创建一个SHA256对象
    sha256_hash = hashlib.sha256()
    # 将字符串编码为字节
    encoded_string = string.encode('utf-8')
    # 更新SHA256对象，传入编码后的字符串
    sha256_hash.update(encoded_string)
    # 获取十六进制表示的哈希值
    return sha256_hash.hexdigest()

if __name__ == '__main__':
    for sty in styles:
        for sex in sexs:
            kind_path = os.path.join(rooturl, sty, sex)
            if os.path.exists(kind_path):
                faces = os.listdir(kind_path)
                for id in faces:
                    with open(os.path.join(kind_path, id, "data.json"), "r", encoding="utf8") as fd:
                        data = json.load(fd)
                    
                    if "time" not in data:
                        data["time"] = time.time()
                        with open(os.path.join(kind_path, id, "data.json"), "w", encoding="utf8") as fd:
                            json.dump(data, fd, ensure_ascii=False)
                    
                    dd = {
                        "id": id,
                        "name": data["name"],
                        "time": data["time"],
                    }
                    if "price" in data and data["price"] is not None:
                        dd["p"] = data["price"]
                    if "code" in data and data["code"] is not None:
                        dd["c"] = data["code"]
                    indexs[sex][sty].append(dd)
                    if not os.path.exists(os.path.join(kind_path, id, "face_front.png")):
                        if not os.path.exists(os.path.join(kind_path, id, "face_front.jpg")):
                            print(sex, " front ", id)
                    if not os.path.exists(os.path.join(kind_path, id, "face_side.png")):
                        if not os.path.exists(os.path.join(kind_path, id, "face_side.jpg")):
                            print(sex, " side ", id)
                    if os.path.exists(os.path.join(kind_path, id, "status.txt")):
                        os.remove(os.path.join(kind_path, id, "status.txt"))
                    if os.path.exists(os.path.join(kind_path, id, "status.png")):
                        os.remove(os.path.join(kind_path, id, "status.png"))
                    
                    if os.path.exists(os.path.join(kind_path, id, "face_front.png")):
                        im = Image.open(os.path.join(kind_path, id, "face_front.png"))
                        im.save(os.path.join(kind_path, id, "face_front.jpg"), quality=80)
                        # os.remove(os.path.join(kind_path, id, "face_front.png"))
                    if os.path.exists(os.path.join(kind_path, id, "face_side.png")):
                        im = Image.open(os.path.join(kind_path, id, "face_side.png"))
                        im.save(os.path.join(kind_path, id, "face_side.jpg"), quality=80)
                        # os.remove(os.path.join(kind_path, id, "face_side.png"))
            faces = sorted(indexs[sex][sty], key=lambda x: x["time"], reverse=True)
            indexs[sex][sty] = faces
    content = json.dumps(indexs, ensure_ascii=False)
    indexs["sha256"] = calculate_sha256(content)
    with open(f"data/faces-index.{indexs["sha256"]}.json", "w", encoding="utf8") as f:
        json.dump(indexs, f, ensure_ascii=False)

    with open(f"src/lib/url.json", "w", encoding="utf8") as f:
        json.dump({
            "index": f"faces-index.{indexs["sha256"]}.json"
        }, f, ensure_ascii=False)
    for sty in styles:
        for sex in sexs:
            with open(f"data/faces-index.{sty}.{sex}.json", "w", encoding="utf8") as f:
                json.dump(indexs[sex][sty], f, ensure_ascii=False)