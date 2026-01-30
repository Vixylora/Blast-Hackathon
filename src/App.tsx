import './App.css'
import { GlitchShaders } from '@/components/ui/glitch'

function App() {

  return (
    <div className="h-screen relative">
      {/* glitch effect */}
      <GlitchShaders className="absolute inset-0 w-full h-full" />

      {/* your content */}
      <div className="relative z-10">
        <h1>Your content here</h1>
      </div>
    </div>
  )
}

export default App
