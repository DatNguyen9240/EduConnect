import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import classNames from "classnames/bind";
import styles from "./Error.module.css";
const cx = classNames.bind(styles);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error(error);
    return { hasError: true, errorInfo: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, info);

    this.setState({
      errorInfo: info,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={cx("wrapper")}>
          <h1 className={cx("title-error")}>
            Something went wrong. Please try again or contact support.
          </h1>

          <details style={{ whiteSpace: "pre-wrap" }}>
            Thông tin lỗi
            {this.state.errorInfo?.componentStack}
          </details>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
