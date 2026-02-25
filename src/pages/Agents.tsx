import { useEffect, useState } from 'react'
import { agentService } from '@/services/agent.service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Users, TrendingUp, Award } from 'lucide-react'

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await agentService.getAgents()
        setAgents(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-gray-600 mt-1">Manage your team</p>
        </div>
        <Button>Add Agent</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <Users className="w-5 h-5 text-primary mb-2" />
          <p className="text-gray-600 text-sm">Total Agents</p>
          <p className="text-2xl font-bold mt-1">{agents.length}</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Total Sales</p>
          <p className="text-2xl font-bold mt-1">{agents.reduce((s, a) => s + (a.total_sales || 0), 0)}</p>
        </Card>
        <Card className="p-4">
          <Award className="w-5 h-5 text-yellow-500 mb-2" />
          <p className="text-gray-600 text-sm">Avg Rating</p>
          <p className="text-2xl font-bold mt-1">{agents.length > 0 ? (agents.reduce((s, a) => s + (a.rating || 0), 0) / agents.length).toFixed(1) : 0}</p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading agents...</p>
        </div>
      ) : agents.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No agents found</p>
          <Button className="mt-4">Create Agent</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-6 hover:shadow-lg transition">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">{agent.specialization || 'Agent'}</h3>
                </div>
                <div className="text-right">
                  <div className="text-yellow-500 font-bold">{agent.rating}/5</div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Profile</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
