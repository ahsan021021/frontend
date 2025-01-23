import { createContext, useContext, useState } from 'react'

const PipelineContext = createContext()

export function PipelineProvider({ children }) {
  const [pipelines, setPipelines] = useState([
    { 
      id: 1, 
      name: 'Facebook Leads',
      stages: [
        { id: 1, name: 'Intake', color: '#6366f1' },
        { id: 2, name: 'In Progress', color: '#f59e0b' },
        { id: 3, name: 'Qualified', color: '#10b981' },
        { id: 4, name: 'Converted', color: '#8b5cf6' }
      ],
      visibleInFunnel: true,
      visibleInPie: true
    }
  ])

  return (
    <PipelineContext.Provider value={{ pipelines, setPipelines }}>
      {children}
    </PipelineContext.Provider>
  )
}

export function usePipelines() {
  const context = useContext(PipelineContext)
  if (!context) {
    throw new Error('usePipelines must be used within a PipelineProvider')
  }
  return context
}