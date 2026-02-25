import { useEffect, useState } from 'react'
import { propertyService } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Target, TrendingUp, Clock, Filter, Download } from 'lucide-react'

export default function SalesPipeline() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertyService.getProperties()
        setProperties(data.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const stages = [
    { id: 'available', label: 'Available', color: 'bg-blue-100 text-blue-800' },
    { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'sold', label: 'Sold', color: 'bg-green-100 text-green-800' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Track deals through stages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <Target className="w-5 h-5 text-primary mb-2" />
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-2xl font-bold">{properties.filter(p => p.status === 'pending').length}</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Sold</p>
          <p className="text-2xl font-bold">{properties.filter(p => p.status === 'sold').length}</p>
        </Card>
        <Card className="p-4">
          <Clock className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-gray-600 text-sm">Days on Market (Avg)</p>
          <p className="text-2xl font-bold">24</p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {stages.map((stage) => {
            const stageProps = properties.filter(p => p.status === stage.id)
            return (
              <div key={stage.id}>
                <div className={`${stage.color} p-3 rounded-lg font-semibold mb-3`}>
                  {stage.label} ({stageProps.length})
                </div>
                <div className="space-y-3">
                  {stageProps.map((prop) => (
                    <Card key={prop.id} className="p-4 hover:shadow-lg">
                      <h4 className="font-bold text-sm">{prop.title}</h4>
                      <p className="font-bold text-primary mt-2">${(prop.price / 1000000).toFixed(1)}M</p>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
