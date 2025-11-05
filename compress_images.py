from PIL import Image
import os
import glob
import shutil

# 设置图片文件夹路径
image_dir = 'd:\\桌面文件\\Hobby Circle\\images'
# 设置大小限制（KB）
size_limit = 200

# 找出所有超过大小限制的图片
large_images = []
for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
    for file_path in glob.glob(os.path.join(image_dir, ext)):
        file_size_kb = os.path.getsize(file_path) / 1024
        if file_size_kb > size_limit:
            large_images.append((file_path, file_size_kb))

print(f"找到 {len(large_images)} 个超过 {size_limit}KB 的图片需要压缩")

# 压缩图片（简化版本，不创建备份）
def compress_image(file_path, target_size_kb=200):
    try:
        # 获取文件扩展名
        file_ext = os.path.splitext(file_path)[1].lower()
        
        # 确定保存格式
        if file_ext == '.jpg' or file_ext == '.jpeg':
            save_format = 'JPEG'
        elif file_ext == '.png':
            save_format = 'PNG'
        elif file_ext == '.webp':
            save_format = 'WEBP'
        else:
            print(f"不支持的文件格式: {file_ext}")
            return False
        
        img = Image.open(file_path)
        
        # 对于JPEG/WEBP文件，使用质量参数压缩
        if save_format in ['JPEG', 'WEBP']:
            # 初始压缩质量
            quality = 85
            
            # 创建临时文件路径
            temp_path = file_path + '.temp'
            
            # 循环调整质量直到达到目标大小
            while True:
                img.save(temp_path, format=save_format, quality=quality, optimize=True)
                temp_size_kb = os.path.getsize(temp_path) / 1024
                
                if temp_size_kb <= target_size_kb or quality <= 30:
                    # 如果达到目标大小或质量过低，完成压缩
                    os.replace(temp_path, file_path)
                    print(f"压缩 {os.path.basename(file_path)}: {temp_size_kb:.2f}KB (质量: {quality})")
                    break
                else:
                    # 继续降低质量
                    quality -= 5
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
        
        # 对于PNG文件，使用optimize参数
        elif save_format == 'PNG':
            img.save(file_path, format=save_format, optimize=True)
            new_size_kb = os.path.getsize(file_path) / 1024
            print(f"压缩 {os.path.basename(file_path)}: {new_size_kb:.2f}KB")
        
        return True
    except Exception as e:
        print(f"压缩 {file_path} 时出错: {str(e)}")
        return False

# 压缩所有大图片
for file_path, file_size_kb in large_images:
    print(f"正在压缩 {os.path.basename(file_path)} ({file_size_kb:.2f}KB)")
    compress_image(file_path)

print("图片压缩完成！")