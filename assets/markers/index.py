import os
from PIL import Image

path = r'C:\Users\mathe\OneDrive\Área de Trabalho\app-amaf\assets\markers'

for file in os.listdir(path):
    if file.endswith('.png'):
        img = Image.open(os.path.join(path, file))
        img = img.resize((250, 250))
        img.save(os.path.join(path, file))
        print(f'{file} resized to 20 x 20')

print('Done')