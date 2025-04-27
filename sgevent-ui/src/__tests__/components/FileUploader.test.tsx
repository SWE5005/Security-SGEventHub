import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUploader from '../../components/FileUploader';
import { toBase64 } from '../../utils';

// Mock the utils
jest.mock('../../utils', () => ({
  toBase64: jest.fn(),
}));

describe('FileUploader Component', () => {
  const defaultProps = {
    label: 'Upload Image',
    value: '',
    onChange: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    (toBase64 as jest.Mock).mockImplementation((file, callback) => {
      callback('data:image/jpeg;base64,test');
    });
  });

  it('renders upload button with label', () => {
    render(<FileUploader {...defaultProps} />);
    
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
  });

  it('handles file upload', () => {
    render(<FileUploader {...defaultProps} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(toBase64).toHaveBeenCalledWith(file, expect.any(Function));
    expect(defaultProps.onChange).toHaveBeenCalledWith('data:image/jpeg;base64,test');
  });

  it('disables upload button when disabled prop is true', () => {
    render(<FileUploader {...defaultProps} disabled={true} />);
    
    const input = screen.getByLabelText('Upload Image');
    expect(input).toBeDisabled();
  });

  it('displays uploaded image', () => {
    render(<FileUploader {...defaultProps} value="data:image/jpeg;base64,test" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'data:image/jpeg;base64,test');
  });

  it('accepts only image files', () => {
    render(<FileUploader {...defaultProps} />);
    
    const input = screen.getByLabelText('Upload Image');
    expect(input).toHaveAttribute('accept', 'image/png, image/jpeg');
  });

  it('clears file input after upload', () => {
    render(<FileUploader {...defaultProps} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(input).toHaveValue('');
  });

  it('updates image when value prop changes', () => {
    const { rerender } = render(<FileUploader {...defaultProps} />);
    
    rerender(<FileUploader {...defaultProps} value="new-image-data" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'new-image-data');
  });

  it('handles empty file selection', () => {
    render(<FileUploader {...defaultProps} />);
    
    const input = screen.getByLabelText('Upload Image');
    fireEvent.change(input, { target: { files: [] } });
    
    expect(toBase64).not.toHaveBeenCalled();
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('handles multiple file selection', () => {
    render(<FileUploader {...defaultProps} />);
    
    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file1, file2] } });
    
    expect(toBase64).toHaveBeenCalledWith(file1, expect.any(Function));
    expect(toBase64).not.toHaveBeenCalledWith(file2, expect.any(Function));
  });

  it('handles file upload error', () => {
    (toBase64 as jest.Mock).mockImplementation((file, callback, errorCallback) => {
      errorCallback(new Error('Upload failed'));
    });

    render(<FileUploader {...defaultProps} />);
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('handles invalid file type', () => {
    render(<FileUploader {...defaultProps} />);
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Image');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(toBase64).not.toHaveBeenCalled();
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
}); 