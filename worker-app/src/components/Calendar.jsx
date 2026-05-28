const Calendar = () => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const dates = Array.from({ length: 31 }, (_, i) => i + 1)
  
  // Highlight some mock due dates
  const dueDates = [12, 18, 25]

  return (
    <div className="usage-card" style={{ padding: '16px' }}>
      <div className="usage-card-header" style={{ marginBottom: '16px' }}>
        <div>
          <p className="usage-title">Schedule</p>
          <p className="usage-plan" style={{ color: 'var(--accent2)' }}>May 2026</p>
        </div>
        <button className="dots-btn">⋯</button>
      </div>

      <div style={gridStyle}>
        {days.map(day => (
          <div key={day} style={dayHeaderStyle}>{day}</div>
        ))}
        {/* Empty slots for month start */}
        <div style={dateStyle}></div>
        <div style={dateStyle}></div>
        <div style={dateStyle}></div>
        <div style={dateStyle}></div>
        <div style={dateStyle}></div>
        
        {dates.map(date => {
          const isDue = dueDates.includes(date)
          const isToday = date === 28
          return (
            <div key={date} style={{
              ...dateStyle,
              background: isToday ? 'var(--accent)' : isDue ? 'rgba(91,106,255,0.15)' : 'transparent',
              color: isToday ? '#fff' : isDue ? 'var(--accent2)' : 'var(--text-1)',
              fontWeight: isToday || isDue ? 'bold' : 'normal',
              border: isDue && !isToday ? '1px solid rgba(91,106,255,0.3)' : '1px solid transparent',
              cursor: 'pointer'
            }}>
              {date}
            </div>
          )
        })}
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }}></div>
          Today
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(91,106,255,0.3)', border: '1px solid var(--accent)' }}></div>
          Task Due
        </div>
      </div>
    </div>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
  textAlign: 'center'
}

const dayHeaderStyle = {
  fontSize: '11px',
  color: 'var(--text-3)',
  fontWeight: '600',
  marginBottom: '8px'
}

const dateStyle = {
  fontSize: '12px',
  padding: '6px 0',
  borderRadius: '4px',
  transition: 'background 0.2s'
}

export default Calendar
