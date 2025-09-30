

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface Props {
  children?: React.ReactNode;
  errorMessage: string;
}

class GlobalError extends React.Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by GlobalError boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError || !this.props.children) {
      return (
        <div className="global-margin" style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <p>{this.props.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalError;
