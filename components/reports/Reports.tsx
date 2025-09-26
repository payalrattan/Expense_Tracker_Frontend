'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'

type ReportItem = {
  label: string
  income: number
  expenses: number
}

export const Reports = () => {
  const [data, setData] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:5002/api/reports', {
          method: 'GET',
          credentials: 'include',
        })

        if (!res.ok) {
          router.push('/login')
          return
        }

        const reports = await res.json()
        setData(reports)
        setLoading(false)
      } catch (err) {
        console.error(err)
        router.push('/login')
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading reports...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Reports</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        {data.map((item) => (
          <div key={item.label} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>{item.label}</h3>
            <p>Income: ${item.income}</p>
            <p>Expenses: ${item.expenses}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>Overview Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#4ade80" />
            <Bar dataKey="expenses" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
