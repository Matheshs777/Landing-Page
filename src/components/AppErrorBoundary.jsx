import { Component } from 'react'
import { ErrorPage } from '../pages/ErrorPage'

/** Last line of defence for runtime crashes outside the 3D viewers. */
export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('Application error:', error, info)
  }

  render() {
    if (this.state.failed) {
      return (
        <ErrorPage
          code="500"
          eyebrow="Unexpected error"
          title="Something interrupted the studio."
          message="A runtime error stopped this page from rendering. Reloading usually clears it; your consent choice is stored locally and will be remembered."
          showReload
        />
      )
    }
    return this.props.children
  }
}
