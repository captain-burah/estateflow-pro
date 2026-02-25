import { useEffect, useState } from 'react'
import { propertyService } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Home, DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function Rentals() {
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const data = await propertyService.getProperties({ status: 'available' })
        setRentals(data.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRentals()
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rentals</h1>
          <p className="text-gray-600 mt-1">Manage rental properties</p>
        </div>
        <Button>Add Rental</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <Home className="w-5 h-5 text-primary mb-2" />
          <p className="text-gray-600 text-sm">Active Rentals</p>
          <p className="text-2xl font-bold mt-1">{rentals.length}</p>
        </Card>
        <Card className="p-4">
          <DollarSign className="w-5 h-5 text-green-500 mb-2" />
          <p className="text-gray-600 text-sm">Monthly Income</p>
          <p className="text-2xl font-bold mt-1">${(rentals.reduce((s, r) => s + (r.price || 0), 0) / 1000).toFixed(0)}k</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
          <p className="text-gray-600 text-sm">Occupancy</p>
          <p className="text-2xl font-bold mt-1">92%</p>
        </Card>
        <Card className="p-4">
          <Calendar className="w-5 h-5 text-purple-500 mb-2" />
          <p className="text-gray-600 text-sm">Renewals</p>
          <p className="text-2xl font-bold mt-1">3</p>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      ) : rentals.length === 0 ? (
        <Card className="p-12 text-center">
          <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <Button className="mt-4">Add Rental</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {rentals.map((r) => (
            <Card key={r.id} className="p-4 flex justify-between">
              <div>
                <h3 className="font-bold">{r.title}</h3>
                <p className="text-sm text-gray-600">{r.bedrooms} bed • {r.city}</p>
              </div>
              <Button variant="outline">Manage</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
