import { useApp } from '../../contexts/AppContext'
import { ScrollToTopFAB } from './FloatingActionButton'

const ScrollToTop = () => {
  const { state } = useApp()

  return <ScrollToTopFAB show={state.showScrollTop} position="bottom-right" />
}

export default ScrollToTop
