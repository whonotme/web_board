import { useRef } from 'react';

/**
 * Hook สำหรับเก็บ mapping ของ Blob URL -> File
 */
export function useImageUpload() {
  const blobFileMapRef = useRef(new Map());

  const addBlob = (blobUrl, file) => {
    blobFileMapRef.current.set(blobUrl, file);
  };

  const removeBlob = (blobUrl) => {
    blobFileMapRef.current.delete(blobUrl);
  };

  const clear = () => {
    blobFileMapRef.current.clear();
  };

  // ฟังก์ชันปรับคุณภาพภาพเหลือ 30%
  const compressImage = (file, quality = 0.3) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, { type: blob.type });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return {
    blobFileMap: blobFileMapRef.current,
    addBlob,
    removeBlob,
    clear,
    compressImage // เพิ่มฟังก์ชันนี้เข้าไป
  };
}