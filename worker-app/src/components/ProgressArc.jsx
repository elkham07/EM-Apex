import { useEffect, useRef } from 'react'

const ProgressArc = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cw = canvas.width
    const ch = canvas.height
    
    ctx.clearRect(0, 0, cw, ch)
    ctx.lineCap = 'round'

    // Background Arc
    ctx.beginPath()
    ctx.arc(cw / 2, ch, 100, Math.PI, 0)
    ctx.lineWidth = 14
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
    ctx.stroke()

    // Foreground Arc (Progress)
    const pct = 0.68
    ctx.beginPath()
    ctx.arc(cw / 2, ch, 100, Math.PI, Math.PI + Math.PI * pct)
    ctx.lineWidth = 14
    ctx.strokeStyle = '#5b6aff'
    ctx.stroke()
  }, [])

  return (
    <div className="usage-card" style={{ marginTop: '20px' }}>
      <div className="usage-card-header">
        <div>
          <p className="usage-title">Your progress</p>
          <p className="usage-plan">Level: Beginner</p>
        </div>
        <button className="dots-btn">⋯</button>
      </div>

      <div className="gauge-wrap">
        <canvas ref={canvasRef} width="220" height="130"></canvas>
        <div className="gauge-center">
          <span className="gauge-pct">68%</span>
        </div>
      </div>
      <p className="gauge-sub">68% to next level</p>
      {/* View achievements and Level up buttons removed as requested */}
    </div>
  )
}

export default ProgressArc
