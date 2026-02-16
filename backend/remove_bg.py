from PIL import Image
import os

def remove_background(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # pixels to transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    input_file = r"c:\Users\Виктор\Desktop\интернет магазин торты\frontend\src\assets\logo.jpg"
    output_file = r"c:\Users\Виктор\Desktop\интернет магазин торты\frontend\src\assets\logo.png"
    
    if os.path.exists(input_file):
        remove_background(input_file, output_file)
    else:
        print(f"Input file not found: {input_file}")
