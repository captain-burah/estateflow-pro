import { useEffect, useState } from 'react'
import { propertyService } from '@/services/property.service'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Globe, Share2, Eye, Settings } from 'lucide-react'

export default function Publishing() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await propertyService.getFeaturedProperties(100)
        setProperties(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const channels = [
    { name: 'MLS', active: true, icon: '📋' },
    { name: 'Zillow', active: true, icon: '🏠' },
    { name: 'Redfin', active: true, icon: '🔍' },
    { name: 'Trulia', active: false, icon: '🎯' },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Publishing</h1>
          <p className="text-gray-600 mt-1">Manage listings across channels</p>
        </div>
        <Button><Share2 className="w-4 h-4 mr-2" />Publish</Button>
      </div>

      <div>
        <h2 className="font-bold mb-3">Active Channels</h2>
        <div className="grid grid-cols-4 gap-4">
          {channels.map((ch) => (
            <Card key={ch.name} className={`p-4 text-center cursor-pointer ${ch.active ? 'border-primary border-2' : ''}`}>
              <div className="text-3xl mb-2">{ch.icon}</div>
              <p className="font-bold">{ch.name}</p>
              <div className={`text-xs mt-2 ${ch.active ? 'text-green-600' : 'text-gray-400'}`}>
                {ch.active ? '✓ Active' : 'Inactive'}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p>Loading...</p>
        </div>
      ) : properties.length === 0 ? (
        <Card className="p-12 text-center">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <Button className="mt-4">Create Listing</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {properties.map((prop) => (
            <Card key={prop.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold">{prop.title}</h3>
                <p className="text-sm text-gray-600">{prop.city}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {prop.views_count || 0} views
                </span>
                <div className="flex gap-1">
                  {channels.filter(c => c.active).map(ch => (
                    <span key={ch.name} className="text-lg">{ch.icon}</span>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm"><Settings className="w-4 h-4" /></Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
