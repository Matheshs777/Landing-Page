import { Component } from 'react'

/**
 * Keeps a failed WebGL context from taking down the page.
 */
export class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('PULSAR 3D scene failed to render:', error, info)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
