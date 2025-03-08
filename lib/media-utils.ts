interface MediaError extends Error {
  name: string;
  message: string;
}

export const requestMediaPermissions = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: true, 
      video: true 
    });
    
    // Stop the tracks immediately after getting permissions
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error: unknown) {
    // Type guard to check if error is a MediaError
    if (error instanceof Error) {
      console.error('Media permissions error:', error);
      
      if (error.name === 'NotAllowedError') {
        throw new Error('Please allow camera and microphone access to join meetings');
      }
    }
    
    // Generic error if we can't determine the specific error type
    throw new Error('Failed to access media devices');
  }
};

// Helper type guard
export function isMediaError(error: unknown): error is MediaError {
  return error instanceof Error && 'name' in error;
}

// Helper function to extract error message
export function getMediaErrorMessage(error: unknown): string {
  if (isMediaError(error)) {
    switch (error.name) {
      case 'NotAllowedError':
        return 'Please allow camera and microphone access to join meetings';
      case 'NotFoundError':
        return 'No camera or microphone found';
      case 'NotReadableError':
        return 'Your camera or microphone is already in use';
      default:
        return error.message;
    }
  }
  return 'An unknown error occurred while accessing media devices';
}
