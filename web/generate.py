import os
import json
import time
from PIL import Image

rooturl = "public/data"

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
                    indexs[sex][sty].append({
                        "id": id,
                        "name": data["name"],
                        "time": data["time"],
                    })
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
                        im.save(os.path.join(kind_path, id, "face_front.jpg"), quality=100)
                        os.remove(os.path.join(kind_path, id, "face_front.png"))
                    if os.path.exists(os.path.join(kind_path, id, "face_side.png")):
                        im = Image.open(os.path.join(kind_path, id, "face_side.png"))
                        im.save(os.path.join(kind_path, id, "face_side.jpg"), quality=100)
                        os.remove(os.path.join(kind_path, id, "face_side.png"))
            faces = sorted(indexs[sex][sty], key=lambda x: x["time"], reverse=True)
            indexs[sex][sty] = faces
    with open("src/assets/index.json", "w", encoding="utf8") as f:
        json.dump(indexs, f, ensure_ascii=False)