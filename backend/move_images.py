import os
import shutil

ARTIFACTS_DIR = r"C:\Users\Виктор\.gemini\antigravity\brain\c80f8c88-7b34-4f43-8e3a-1348de04702f"
DEST_DIR = r"C:\Users\Виктор\Desktop\интернет магазин торты\backend\static\images"

mapping = {
    "napoleon_cake_v4_1771111883352.png": "napoleon.png",
    "medovik_cake_v3_1771111789894.png": "medovik.png",
    "red_velvet_cake_v2_1771111933555.png": "red_velvet.png",
    "cheesecake_jpg_1771110665880.png": "cheesecake.png",
    "fruit_cake_jpg_1771110653613.png": "fruit.png",
    "chocolate_cake_jpg_1771110642026.png": "truffle.png"
}

def move_images():
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
        
    for artifact, dest_name in mapping.items():
        src = os.path.join(ARTIFACTS_DIR, artifact)
        dst = os.path.join(DEST_DIR, dest_name)
        
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"Copied {artifact} to {dest_name}")
        else:
            print(f"Source not found: {src}")

if __name__ == "__main__":
    move_images()
