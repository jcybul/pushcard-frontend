'use client'

import { useState } from 'react'

interface PunchCardManagerProps {
  onClose: () => void
}

export function PunchCardManager({ onClose }: PunchCardManagerProps) {
  const [activeTab, setActiveTab] = useState<'customers' | 'cards' | 'analytics'>('customers')
  const [customers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      totalCards: 3,
      activeCards: 2,
      totalPunches: 15,
      lastActivity: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      totalCards: 1,
      activeCards: 1,
      totalPunches: 8,
      lastActivity: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      totalCards: 2,
      activeCards: 1,
      totalPunches: 12,
      lastActivity: '2024-01-13T09:20:00Z'
    }
  ])

  const [punchCards] = useState([
    {
      id: '1',
      name: 'Coffee Card',
      businessName: 'Brew & Bean',
      totalCustomers: 45,
      totalPunches: 234,
      completionRate: 68,
      avgCompletionTime: '12 days'
    },
    {
      id: '2',
      name: 'Sandwich Card',
      businessName: 'Delicious Deli',
      totalCustomers: 23,
      totalPunches: 156,
      completionRate: 72,
      avgCompletionTime: '8 days'
    }
  ])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-4 w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Punch Card Management</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'customers', label: 'Customers', count: customers.length },
              { id: 'cards', label: 'Punch Cards', count: punchCards.length },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Customer List</h4>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Add Customer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cards
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Punches
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.activeCards}/{customer.totalCards} active
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.totalPunches}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                          View
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Punch Cards Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-900">Punch Card Templates</h4>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                Create New Card
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {punchCards.map((card) => (
                <div key={card.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="text-lg font-semibold text-gray-900">{card.name}</h5>
                      <p className="text-sm text-gray-600">{card.businessName}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Customers:</span>
                      <span className="font-medium">{card.totalCustomers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Punches:</span>
                      <span className="font-medium">{card.totalPunches}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion Rate:</span>
                      <span className="font-medium">{card.completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Completion:</span>
                      <span className="font-medium">{card.avgCompletionTime}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-md text-sm hover:bg-indigo-700">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700">
                      Analytics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-900">Business Analytics</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-blue-600">Total Customers</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">3,891</div>
                <div className="text-sm text-green-600">Active Cards</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-purple-600">Punches Today</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">68%</div>
                <div className="text-sm text-orange-600">Avg. Completion</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New customer registrations this week</span>
                  <span className="text-sm font-medium text-gray-900">+23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cards completed this week</span>
                  <span className="text-sm font-medium text-gray-900">+45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average punches per customer</span>
                  <span className="text-sm font-medium text-gray-900">12.3</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
