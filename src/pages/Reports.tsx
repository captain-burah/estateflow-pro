import { useEffect, useState } from 'react'
import { propertyService } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart3, TrendingUp, PieChart, Download, Filter } from 'lucide-react'

export default function Reports() {
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

  const total = properties.reduce((s, p) => s + (p.price || 0), 0)
  const avg = properties.length > 0 ? total / properties.length : 0

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600 mt-1">Analyze your portfolio performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <BarChart3 className="w-5 h-5 text-primary mb-2" />
          <p className="text-gray-600 text-sm">Total Properties</p>
          <p className="text-2xl font-bold">{properties.length}</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Portfolio Value</p>
          <p className="text-2xl font-bold">${(total / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <PieChart className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-gray-600 text-sm">Average Price</p>
          <p className="text-2xl font-bold">${(avg / 1000000).toFixed(2)}M</p>
        </Card>
        <Card className="p-4">
          <BarChart3 className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-gray-600 text-sm">Market Share</p>
          <p className="text-2xl font-bold">24%</p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Property Types</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm">Residential</span>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-blue-500 h-2 rounded" style={{width: '65%'}} />
                </div>
              </div>
              <div>
                <span className="text-sm">Commercial</span>
                <div className="w-full bg-gray-200 rounded h-2 mt-1">
                  <div className="bg-green-500 h-2 rounded" style={{width: '35%'}} />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Insights</h3>
            <div className="space-y-2 text-sm">
              <p>• Total Properties: <span className="font-bold">{properties.length}</span></p>
              <p>• Portfolio Value: <span className="font-bold">${(total / 1000000).toFixed(1)}M</span></p>
              <p>• Average Price: <span className="font-bold">${(avg / 1000000).toFixed(2)}M</span></p>
              <p>• Market Expansion: <span className="font-bold">+12% YoY</span></p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
