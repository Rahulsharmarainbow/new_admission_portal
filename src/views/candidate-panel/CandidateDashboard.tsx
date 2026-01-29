// components/candidate/CandidateDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, Spinner, ModalHeader, ModalBody } from 'flowbite-react';
import { 
  HiDocumentText, 
  HiClock, 
  HiCurrencyRupee, 
  HiCash,
  HiPencil,
  HiRefresh,
  HiExclamationCircle,
  HiCheckCircle,
  HiXCircle,
  HiDocumentDownload
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useCandidateAuth } from 'src/hook/CandidateAuthContext';
import axios from 'axios';
import Header from 'src/Frontend/Common/Header';
import { C } from 'node_modules/react-router/dist/development/index-react-server-client-BeVfPpWg.d.mts';

interface Application {
  s_no: number;
  application_id: number;
  form_name: string;
  payment_status: number; // 0 = Initialized, 1 = Paid
  applied_at: string;
  amount?: number;
  caste_id?: number;
  location_id?: number;
  transaction_id?: string;
}

interface DashboardCounts {
  total_paid_applications: number;
  total_initialized_applications: number;
  total_paid_transactions: number;
  total_paid_amount: number;
}

interface DashboardResponse {
  status: boolean;
  dashboard_counts: DashboardCounts;
  applications_list: Application[];
  total_applications: number;
}

interface PayableAmountResponse {
  total_payable_fee: number;
  total_fee: number;
  discount_amount: number;
  processing_fee: number;
  gst_amount: number;
  other_charges: number;
}

interface PaymentData {
  total_payable_fee: number;
  total_fee: number;
  discount_amount: number;
  processing_fee: number;
  gst_amount: number;
  other_charges: number;
}

interface InstituteData {
  razorpay_api_key?: string;
  payment_type?: number; // 1 = Razorpay, 2 = PG Direct
  name?: string;
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
            {prefix}{value.toLocaleString()}
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
  const {
    candidateUser,
    candidateToken,
    logout,
    isAuthenticated,
  } = useCandidateAuth();
  
  const navigate = useNavigate();
  let { institute_id } = useParams();
  const [stats, setStats] = useState<DashboardCounts>({
    total_paid_applications: 0,
    total_initialized_applications: 0,
    total_paid_transactions: 0,
    total_paid_amount: 0
  });
  const [applications, setApplications] = useState<Application[]>([]);
  const[baseUrl,setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [instituteData, setInstituteData] = useState<InstituteData>({});
  const [credentialData, setCredentialData] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadingReceiptId, setDownloadingReceiptId] = useState(null);


  const rowsPerPage = 10;
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; 
  }
  // Load Razorpay script
  useEffect(() => {
    fetchInstituteData();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Payment gateway loading failed. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchInstituteData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/Public/Get-header-footer`, {
        unique_code: institute_id,
      });
      if (response.data?.header) {
        setInstituteData(response.data);        
      }
    } catch (error) {
      console.error('Error fetching institute data:', error);
    }
  };

  const fetchDashboardData = async (page = 0, refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const academicId = candidateUser?.academic_id || '';
      const sId = candidateUser?.id || '';
      const currentYear = new Date().getFullYear();

      const response = await axios.post(
        `${apiUrl}/Candidates/get-candidate-dashboard`,
        {},
        {
          params: {
            page,
            rowsPerPage,
            order: 'desc',
            orderBy: 'id',
            year: currentYear,
            academic_id: academicId,
            s_id: sId,
            unique_code: institute_id,
          },
          headers: {
            'Authorization': `Bearer ${candidateToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const data: DashboardResponse = response.data;

      if (data.status) {
        setStats(data.dashboard_counts);
        setApplications(data.applications_list);
        setBaseUrl(data.baseUrl);
        setTotalApplications(data.total_applications);
        setCurrentPage(page);
        setCredentialData(data.credentials);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPayableAmount = async (application: Application) => {
    try {
      const response = await axios.post(`${apiUrl}/Public/Get-payable-amount`, {
        caste_id: application.caste_id,
        academic_id: candidateUser?.academic_id,
        class_id: application.class_id,
        location_id: application.location_id,
        formId:application.form_id
      });

      if (response.data?.total_payable_fee) {
        setPaymentData(response.data);
        return response.data;
      } else {
        toast.error('Unable to calculate payment amount');
        return null;
      }
    } catch (error) {
      console.error('Error fetching payable amount:', error);
      toast.error('Failed to calculate payment amount');
      return null;
    }
  };

  const handlePayment = useCallback(async () => {
    if (!selectedApplication || !paymentData) return;

    

    try {
      const paymentAmount = Math.round(paymentData.total_payable_fee * 100); // Convert to paise

      // Create Razorpay order
      const orderResponse = await axios.post(`${apiUrl}/frontend/razorpay-order`, {
        amount: paymentAmount,
        academic_id: candidateUser?.academic_id,
        receipt: `receipt_${selectedApplication.application_id}`,
      }, {
        headers: {
          'Authorization': `Bearer ${candidateToken}`,
        }
      });

      const order = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: credentialData.razorpay_api_key,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: instituteData.name || 'University Admission',
        description: `Payment for Application ${selectedApplication.application_id}`,
        order_id: order.id,
        handler: async (paymentResponse: any) => {
          setPaymentLoading(true);
          try {
             const apiEndpoint = order.academic_type == 1 
          ? `${apiUrl}/frontend/school-save-final-step-data`
          : `${apiUrl}/frontend/college-save-final-step-data`;

            const verifyResponse = await axios.post(
              apiEndpoint,
              {
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                academic_id: candidateUser?.academic_id,
                application_id: selectedApplication.application_id,
                transaction_id: selectedApplication.transaction_id || '',
              },
              {
                headers: {
                  'Authorization': `Bearer ${candidateToken}`,
                }
              }
            );

            if (verifyResponse.data.success) {
              setPaymentSuccess(true);
              toast.success('Payment successful!');
              
              // Refresh dashboard data after successful payment
              setTimeout(() => {
                fetchDashboardData(currentPage, true);
                setShowPaymentModal(false);
                setPaymentSuccess(false);
                setPaymentLoading(false);
              }, 1000);
            } else {
              toast.error('Payment verification failed');
              setPaymentLoading(false);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: candidateUser?.name || '',
          email: candidateUser?.email || '',
          contact: candidateUser?.mobile || '',
        },
        notes: {
          application_id: selectedApplication.application_id.toString(),
          candidate_id: candidateUser?.id?.toString(),
        },
        theme: {
          color: '#1e40af',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            setPaymentLoading(false);
            
            toast('Payment cancelled', { icon: '⚠️' });
          },
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment initialization failed:', error);
    } finally {
      setPaymentLoading(false);
    }
  }, [selectedApplication, paymentData, instituteData, candidateUser, candidateToken, apiUrl, currentPage]);

  const handlePGDirectPayment = useCallback(async () => {
    if (!selectedApplication || !paymentData) return;

    setPaymentLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/payment/initiate`,
        {
          amount: Number(paymentData.total_payable_fee)?.toFixed(2),
          customerEmailID: candidateUser?.email || '',
          customerMobileNo: candidateUser?.mobile || '',
          academic_id: candidateUser?.academic_id,
          application_id: selectedApplication.application_id,
          transaction_id: selectedApplication.transaction_id || '',
          pageFinalredirect: window.location.href
        },
        {
          headers: {
            'Authorization': `Bearer ${candidateToken}`,
          }
        }
      );

      if (response.data.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Unable to initiate payment');
      }
    } catch (error) {
      console.error('PG payment initiation failed:', error);
      toast.error('Payment initiation failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  }, [selectedApplication, paymentData, candidateUser, candidateToken, apiUrl]);

  const initiatePayment = async (application: Application) => {
    console.log(application);
    setSelectedApplication(application);
    setPaymentSuccess(false);
    
    // First fetch payable amount
    const payableData = await fetchPayableAmount(application);
    
    if (payableData) {
      setPaymentData(payableData);
      setShowPaymentModal(true);
    }
  };

  const handlePayNowClick = async () => {
    // setShowPaymentModal(false);
    if (credentialData.payment_type === 1) {
      await handlePayment();
    } else if (credentialData.payment_type === 2) {
      await handlePGDirectPayment();
    } else {
      toast.error('Payment method not configured');
    }
  };

useEffect(() => {
  if (!candidateToken) {
    // window.location.href  = baseUrl+"/CandidatePanel/login";
    const currentPath = window.location.pathname;
    const loginPath = currentPath.replace('/dashboard', '/login');
    navigate(loginPath);
    return; 
  }

  fetchDashboardData();
}, [candidateToken, institute_id]);


const handleLogout = () => {
  logout();
   const currentPath = window.location.pathname;
    const loginPath = currentPath.replace('/dashboard', '/login');
    navigate(loginPath);
    return; 
};

  const handleEditApplication = (applicationId: number) => {
    // console.log(`${baseUrl}/CandidatePanel/edit-application/${applicationId}`);return false;
      navigate(`/${baseUrl}/CandidatePanel/edit-application/${applicationId}`, { replace: true });

  };

  const handleRefresh = () => {
    fetchDashboardData(currentPage, true);
  };

  const handlePageChange = (newPage: number) => {
    fetchDashboardData(newPage);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPaymentStatusText = (status: number) => {
    return status === 1 ? 'Paid' : 'Initialized';
  };

  const handleDownloadReceipt = async (application_id: string) => {
      setDownloadingReceiptId(application_id);
        try {
          const response = await fetch(`${apiUrl}/Candidates/download-receipt`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${candidateToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ application_id })
          });
          const data = await response.json();
          if (data && data.pdf && data.filename) {
            const { pdf, filename } = data;
            const binaryString = window.atob(pdf);
            const bytes = new Uint8Array(binaryString.length);
            
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            const downloadFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          
          console.error('Receipt download failed:', error);
          toast.error('Receipt download failed. Please try again.');
        }
        finally {
          setDownloadingReceiptId(null);
        }
      };

  const getPaymentStatusColor = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const totalPages = Math.ceil(totalApplications / rowsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
              baseUrl={instituteData?.baseUrl}
              institute_id={institute_id}
              instituteName={instituteData.header?.name}
              logo={instituteData.header?.logo}
              address={instituteData.header?.address}
              otherLogo={instituteData.header?.academic_new_logo}
            />
      
      <main className="flex-grow bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
              <p className="text-gray-600 mt-2">View and manage your applications</p>
            </div>
            <div className="flex items-center gap-4">
            <Button
              color="light"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <HiRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
             
              <Button 
                size="sm" 
                color="alternate" 
                onClick={handleLogout}
                className="hover:bg-gray-200"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Paid Applications"
              value={stats.total_paid_applications}
              icon={<HiDocumentText className="h-6 w-6" />}
              color="#10B981"
            />
            <StatCard
              title="Total Initialized Applications"
              value={stats.total_initialized_applications}
              icon={<HiClock className="h-6 w-6" />}
              color="#F59E0B"
            />
            <StatCard
              title="Total Paid Transactions"
              value={stats.total_paid_transactions}
              icon={<HiCash className="h-6 w-6" />}
              color="#3B82F6"
            />
            <StatCard
              title="Total Paid Amount"
              value={stats.total_paid_amount}
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
                <p className="text-gray-600">
                  Showing {applications.length} of {totalApplications} applications
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner size="xl" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table hoverable>
                    <TableHead>
                      <TableHeadCell>S.No</TableHeadCell>
                      <TableHeadCell>Application ID</TableHeadCell>
                      <TableHeadCell>Name</TableHeadCell>
                      <TableHeadCell>Form Name</TableHeadCell>
                      <TableHeadCell>Payment Status</TableHeadCell>
                      <TableHeadCell>Applied At</TableHeadCell>
                      <TableHeadCell>Actions</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                      {applications.map((app) => (
                        <TableRow key={app.application_id} className="hover:bg-gray-50">
                          <TableCell>{app.s_no}</TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {app.application_id}
                          </TableCell>
                          <TableCell>{app.applicant_name}</TableCell>
                          <TableCell>{app.form_name}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(app.payment_status)}`}>
                              {getPaymentStatusText(app.payment_status)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDateTime(app.applied_at)}</TableCell>
                          <TableCell>
                            {app.payment_status === 0 ? (
                              <div className="flex gap-2">
                               <Link
                                  to={`${baseUrl}/CandidatePanel/edit-application/${app.application_id}`}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                  <HiPencil className="h-4 w-4 mr-1" />
                                  Edit
                                </Link>
                                <Button
                                  size="xs"
                                  color="blue"
                                  onClick={() => initiatePayment(app)}
                                  disabled={paymentLoading}
                                >
                                  {paymentLoading && selectedApplication?.application_id === app.application_id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    'Pay Now'
                                  )}
                                </Button>
                              </div>
                            ) : (
                               <div className="flex gap-2">
                                <Button
                                  size="xs"
                                  color="gray"
                                  onClick={() => handleDownloadReceipt(app.id)}
                                  disabled={downloadingReceiptId === app.id}
                                  className="inline-flex items-center gap-1"
                                >
                                   {downloadingReceiptId == app.id ? (
                                      <>
                                        <Spinner size="sm" className="mr-1" />
                                        Downloading...
                                      </>
                                    ) : (
                                      <>
                                        <HiDocumentDownload className="h-4 w-4" />
                                        Download PDF
                                      </>
                                    )}
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 border-t pt-4">
                    <div className="text-sm text-gray-700">
                      Page {currentPage + 1} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </main>

      <Modal
  show={paymentLoading}
  size="md"
  popup
  onClose={() => {}}
  dismissible={false}
>
  
  <ModalBody>
    <div className="text-center">
      <Spinner size="xl" className="mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        Processing Payment
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Please wait while we redirect you to the payment gateway...
      </p>
    </div>
  </ModalBody>
</Modal>

      <Modal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        size="md"
      >
        <ModalHeader>
          {paymentSuccess ? 'Payment Successful' : 'Complete Payment'}
        </ModalHeader>
        <ModalBody>
          {paymentSuccess ? (
            <div className="text-center py-8">
              <HiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your payment for Application {selectedApplication?.application_id} has been processed successfully.
              </p>
            </div>
          ) : (
            <>

            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            {/* Dialog Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-center text-xl font-bold text-green-600">Confirm Payment</h3>
            </div>

            {/* Dialog Content */}
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  ₹ {paymentData?.total_payable_fee?.toLocaleString('en-IN')}
                </div>
                <p className="text-gray-600 text-sm">
                  You will be redirected to secure payment gateway
                </p>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-center gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentModal(false)}
                  disabled={paymentLoading}
                className={`flex-1 px-4 py-2 border border-gray-400 text-gray-700 rounded-lg font-semibold transition-colors duration-200 ${
                  paymentLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                 onClick={handlePayNowClick}
                  disabled={paymentLoading}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
                  paymentLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                }`}
              >
                {paymentLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Proceed to Pay'
                )}
              </button>
            </div>
          </div>
        </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};






// // components/candidate/CandidateDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { Button, Card, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
// import { 
//   HiDocumentText, 
//   HiClock, 
//   HiCurrencyRupee, 
//   HiCash,
//   HiPencil,
//   HiRefresh,
//   HiExclamationCircle
// } from 'react-icons/hi';
// import { toast } from 'react-hot-toast';
// import { useCandidateAuth } from 'src/hook/CandidateAuthContext';

// interface Application {
//   s_no: number;
//   application_id: number;
//   form_name: string;
//   payment_status: number; // 0 = Initialized, 1 = Paid
//   applied_at: string;
//   amount?: number; // Optional, might come from API
// }

// interface DashboardCounts {
//   total_paid_applications: number;
//   total_initialized_applications: number;
//   total_paid_transactions: number;
//   total_paid_amount: number;
// }

// interface DashboardResponse {
//   status: boolean;
//   dashboard_counts: DashboardCounts;
//   applications_list: Application[];
//   total_applications: number;
// }

// interface StatCardProps {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   color: string;
//   prefix?: string;
// }

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, prefix = '' }) => {
//   return (
//     <Card className="hover:shadow-lg transition-shadow duration-300">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-gray-600 mb-1">{title}</p>
//           <p className="text-2xl font-bold" style={{ color }}>
//             {prefix}{value.toLocaleString()}
//           </p>
//         </div>
//         <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
//           <div style={{ color }}>{icon}</div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export const CandidateDashboard: React.FC = () => {
//   const {
//         candidateUser,
//         candidateToken,
//         logout,
//         isAuthenticated,
//       } = useCandidateAuth();
//   const navigate = useNavigate();
//   const [stats, setStats] = useState<DashboardCounts>({
//     total_paid_applications: 0,
//     total_initialized_applications: 0,
//     total_paid_transactions: 0,
//     total_paid_amount: 0
//   });
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [totalApplications, setTotalApplications] = useState(0);
//     const { institute_id } = useParams();
//   const rowsPerPage = 10;
// const apiUrl = import.meta.env.VITE_API_URL;
//   const fetchDashboardData = async (page = 0, refresh = false) => {
//     try {
//       if (refresh) {
//         setIsRefreshing(true);
//       } else {
//         setIsLoading(true);
//       }
      
//       // Get academic_id and other required params from localStorage or context
//       const academicId = candidateUser.academic_id || '';
//       const sId = candidateUser.id || '';
//       const currentYear = new Date().getFullYear();

//       const response = await fetch(
//         `${apiUrl}/Candidates/get-candidate-dashboard?page=${page}&rowsPerPage=${rowsPerPage}&order=desc&orderBy=id&year=${currentYear}&academic_id=${academicId}&s_id=${sId}`,
//         {
//           method: 'POST',
//           headers: {
//             'accept': '/',
//             'authorization': `Bearer ${candidateToken}`,
//             'content-type': 'application/json',
//           }
//         }
//       );

//       const data: DashboardResponse = await response.json();

//       if (data.status) {
//         setStats(data.dashboard_counts);
//         setApplications(data.applications_list);
//         setTotalApplications(data.total_applications);
//         setCurrentPage(page);
//         toast.success('Dashboard data loaded successfully');
//       } else {
//         toast.error('Failed to load dashboard data');
//       }
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Error loading dashboard. Please try again.');
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate(`/Fronted/${institute_id}/CandidatePanel/login`);
//   };

//   const handleEditApplication = (applicationId: number) => {
//     // Navigate to edit application page
//     navigate(`/CandidatePanel/application/edit/${applicationId}`);
//   };

//   const handlePayNow = (applicationId: number) => {
//     // Call payment API
//     toast.success(`Payment initiated for application ${applicationId}`);
//     // In real implementation, call payment service
//     // paymentService.initiatePayment(applicationId);
//   };

//   const handleRefresh = () => {
//     fetchDashboardData(currentPage, true);
//   };

//   const handlePageChange = (newPage: number) => {
//     fetchDashboardData(newPage);
//   };

//   const formatDateTime = (dateTime: string) => {
//     const date = new Date(dateTime);
//     return date.toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getPaymentStatusText = (status: number) => {
//     return status === 1 ? 'Paid' : 'Initialized';
//   };

//   const getPaymentStatusColor = (status: number) => {
//     return status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
//   };

//   const totalPages = Math.ceil(totalApplications / rowsPerPage);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Header - Assuming you have a proper Header component */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-xl font-semibold text-gray-900">Admission Portal</h1>
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-gray-700">Welcome, Candidate!</span>
//               <Button 
//                 size="sm" 
//                 color="gray" 
//                 onClick={handleLogout}
//                 className="hover:bg-gray-200"
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       <main className="flex-grow bg-gray-50 py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Dashboard Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
//               <p className="text-gray-600 mt-2">View and manage your applications</p>
//             </div>
//             <Button
//               color="light"
//               onClick={handleRefresh}
//               disabled={isRefreshing}
//               className="flex items-center gap-2"
//             >
//               <HiRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
//               {isRefreshing ? 'Refreshing...' : 'Refresh'}
//             </Button>
//           </div>

//           {/* Statistics Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <StatCard
//               title="Total Paid Applications"
//               value={stats.total_paid_applications}
//               icon={<HiDocumentText className="h-6 w-6" />}
//               color="#10B981"
//             />
//             <StatCard
//               title="Total Initialized Applications"
//               value={stats.total_initialized_applications}
//               icon={<HiClock className="h-6 w-6" />}
//               color="#F59E0B"
//             />
//             <StatCard
//               title="Total Paid Transactions"
//               value={stats.total_paid_transactions}
//               icon={<HiCash className="h-6 w-6" />}
//               color="#3B82F6"
//             />
//             <StatCard
//               title="Total Paid Amount"
//               value={stats.total_paid_amount}
//               icon={<HiCurrencyRupee className="h-6 w-6" />}
//               color="#8B5CF6"
//               prefix="₹"
//             />
//           </div>

//           {/* Applications Table */}
//           <Card className="mb-8">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Your Applications</h2>
//                 <p className="text-gray-600">
//                   Showing {applications.length} of {totalApplications} applications
//                 </p>
//               </div>
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <Table hoverable>
//                     <TableHead>
//                       <TableHeadCell>S.No</TableHeadCell>
//                       <TableHeadCell>Application ID</TableHeadCell>
//                       <TableHeadCell>Form Name</TableHeadCell>
//                       <TableHeadCell>Payment Status</TableHeadCell>
//                       <TableHeadCell>Applied At</TableHeadCell>
//                       <TableHeadCell>Actions</TableHeadCell>
//                     </TableHead>
//                     <TableBody className="divide-y">
//                       {applications.map((app) => (
//                         <TableRow key={app.application_id} className="hover:bg-gray-50">
//                           <TableCell>{app.s_no}</TableCell>
//                           <TableCell className="font-medium text-blue-600">
//                             {app.application_id}
//                           </TableCell>
//                           <TableCell>{app.form_name}</TableCell>
//                           <TableCell>
//                             <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(app.payment_status)}`}>
//                               {getPaymentStatusText(app.payment_status)}
//                             </span>
//                           </TableCell>
//                           <TableCell>{formatDateTime(app.applied_at)}</TableCell>
//                           <TableCell>
//                             {app.payment_status === 0 ? (
//                               <div className="flex gap-2">
//                                 <Button
//                                   size="xs"
//                                   color="gray"
//                                   onClick={() => handleEditApplication(app.application_id)}
//                                 >
//                                   <HiPencil className="h-4 w-4 mr-1" />
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   size="xs"
//                                   color="blue"
//                                   onClick={() => handlePayNow(app.application_id)}
//                                 >
//                                   Pay Now
//                                 </Button>
//                               </div>
//                             ) : (
//                               <span className="text-gray-500 text-sm">No actions available</span>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="flex items-center justify-between mt-6 border-t pt-4">
//                     <div className="text-sm text-gray-700">
//                       Page {currentPage + 1} of {totalPages}
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         color="light"
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 0}
//                       >
//                         Previous
//                       </Button>
//                       <Button
//                         size="sm"
//                         color="light"
//                         onClick={() => handlePageChange(currentPage + 1)}
//                         disabled={currentPage === totalPages - 1}
//                       >
//                         Next
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// };