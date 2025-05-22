"use client";

import type React from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface FileDownloadButtonProps extends ButtonProps {
  content: string;
  filename: string;
  fileType?: string;
  children: React.ReactNode;
}

export const FileDownloadButton: React.FC<FileDownloadButtonProps> = ({
  content,
  filename,
  fileType = 'text/plain;charset=utf-8',
  children,
  ...props
}) => {
  const handleDownload = () => {
    if (typeof window !== "undefined") { // Ensure this runs only on client
      const blob = new Blob([content], { type: fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Button onClick={handleDownload} {...props}>
      <Download className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};
