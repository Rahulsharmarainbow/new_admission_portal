// components/candidate/CandidateDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { 
  HiDocumentText, 
  HiClock, 
  HiCurrencyRupee, 
  HiCash,
  HiPencil,
  HiArrowRight
} from 'react-icons/hi';

// Mock data for demonstration
const mockApplicationData = {
  stats: {
    totalPaidApplications: 15,
    totalInitializedApplications: 8,
    totalPaidTransactions: 23,
    totalPaidAmount: 45250
  },
  applications: [
    {
      id: 1,
      application_id: 'APP001',
      form_name: 'MBA Admission Form 2024',
      payment_status: 'Paid',
      amount: 1500,
      applied_at: '2024-01-15 10:30 AM',
      last_updated: '2024-01-15 10:30 AM'
    },
    {
      id: 2,
      application_id: 'APP002',
      form_name: 'B.Tech Application Form',
      payment_status: 'Initialized',
      amount: 1200,
      applied_at: '2024-01-14 02:45 PM',
      last_updated: '2024-01-14 02:45 PM'
    },
    {
      id: 3,
      application_id: 'APP003',
      form_name: 'MCA Entrance Form',
      payment_status: 'Paid',
      amount: 1000,
      applied_at: '2024-01-13 11:20 AM',
      last_updated: '2024-01-13 11:20 AM'
    },
    {
      id: 4,
      application_id: 'APP004',
      form_name: 'PhD Application Form',
      payment_status: 'Paid',
      amount: 2000,
      applied_at: '2024-01-12 09:15 AM',
      last_updated: '2024-01-12 09:15 AM'
    },
    {
      id: 5,
      application_id: 'APP005',
      form_name: 'MBA Admission Form 2024',
      payment_status: 'Initialized',
      amount: 1500,
      applied_at: '2024-01-11 04:30 PM',
      last_updated: '2024-01-11 04:30 PM'
    },
    {
      id: 6,
      application_id: 'APP006',
      form_name: 'B.Sc Application Form',
      payment_status: 'Paid',
      amount: 800,
      applied_at: '2024-01-10 01:20 PM',
      last_updated: '2024-01-10 01:20 PM'
    },
    {
      id: 7,
      application_id: 'APP007',
      form_name: 'M.Sc Application Form',
      payment_status: 'Paid',
      amount: 900,
      applied_at: '2024-01-09 10:45 AM',
      last_updated: '2024-01-09 10:45 AM'
    },
    {
      id: 8,
      application_id: 'APP008',
      form_name: 'BA Admission Form',
      payment_status: 'Initialized',
      amount: 700,
      applied_at: '2024-01-08 03:15 PM',
      last_updated: '2024-01-08 03:15 PM'
    }
  ]
};

interface Application {
  id: number;
  application_id: string;
  form_name: string;
  payment_status: 'Paid' | 'Initialized';
  amount: number;
  applied_at: string;
  last_updated: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, prefix = '' }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold" style={{ color }}>
            {prefix}{value}
          </p>
        </div>
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </Card>
  );
};

export const CandidateDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(mockApplicationData.stats);
  const [applications, setApplications] = useState<Application[]>(mockApplicationData.applications);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In real implementation, fetch data from API
    // fetchCandidateDashboardData();
  }, []);

  const handleLogout = () => {
    // Clear candidate session/token
    localStorage.removeItem('candidate_token');
    navigate('/CandidatePanel/login');
  };

  const handleEditApplication = (applicationId: string) => {
    // Navigate to edit application page
    navigate(`/CandidatePanel/application/edit/${applicationId}`);
  };

  const handlePayNow = (applicationId: string) => {
    // Call the same payment function as apply page
    // paymentService.initiatePayment(applicationId);
    alert(`Payment initiated for ${applicationId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logout */}
      {/* <Header> */}
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Welcome, Candidate!</span>
          <Button 
            size="sm" 
            color="gray" 
            onClick={handleLogout}
            className="hover:bg-gray-200"
          >
            Logout
          </Button>
        </div>
      {/* </Header> */}
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
            <p className="text-gray-600 mt-2">View and manage your applications</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Paid Applications"
              value={stats.totalPaidApplications}
              icon={<HiDocumentText className="h-6 w-6" />}
              color="#10B981"
            />
            <StatCard
              title="Total Initialized Applications"
              value={stats.totalInitializedApplications}
              icon={<HiClock className="h-6 w-6" />}
              color="#F59E0B"
            />
            <StatCard
              title="Total Paid Transactions"
              value={stats.totalPaidTransactions}
              icon={<HiCash className="h-6 w-6" />}
              color="#3B82F6"
            />
            <StatCard
              title="Total Paid Amount"
              value={stats.totalPaidAmount}
              icon={<HiCurrencyRupee className="h-6 w-6" />}
              color="#8B5CF6"
              prefix="₹"
            />
          </div>

          {/* Applications Table */}
          <Card className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
                <p className="text-gray-600">View and manage all your submitted applications</p>
              </div>
              {/* <Button color="blue" onClick={() => navigate('/apply')}>
                <HiArrowRight className="mr-2 h-5 w-5" />
                Apply for New
              </Button> */}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table hoverable>
                  <TableHead>
                    <TableHeadCell>S.No</TableHeadCell>
                    <TableHeadCell>Application ID</TableHeadCell>
                    <TableHeadCell>Form Name</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Payment Status</TableHeadCell>
                    <TableHeadCell>Applied At</TableHeadCell>
                    <TableHeadCell>Actions</TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {applications.map((app, index) => (
                      <TableRow key={app.id} className="hover:bg-gray-50">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {app.application_id}
                        </TableCell>
                        <TableCell>{app.form_name}</TableCell>
                        <TableCell>₹{app.amount}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            app.payment_status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.payment_status}
                          </span>
                        </TableCell>
                        <TableCell>{app.applied_at}</TableCell>
                        <TableCell>

                         {app.payment_status === 'Paid' ? 
                        <></> :
                         <div className="flex gap-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => handleEditApplication(app.application_id)}
                            >
                              <HiPencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {app.payment_status === 'Initialized' && (
                              <Button
                                size="xs"
                                color="blue"
                                onClick={() => handlePayNow(app.application_id)}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {applications.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <HiDocumentText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any applications yet.</p>
                <Button color="blue" onClick={() => navigate('/apply')}>
                  Apply Now
                </Button>
              </div>
            )}
          </Card>

          {/* Additional Info Card */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You can edit applications that are in "Initialized" status</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Applications with "Paid" status cannot be edited</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Click "Pay Now" to complete payment for initialized applications</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>All payments are secure and processed through Razorpay</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>For any issues, please contact support@example.com</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>
      
      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};