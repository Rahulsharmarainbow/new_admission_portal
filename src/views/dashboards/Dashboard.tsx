import ProductCards from 'src/components/dashboard/ProductCards';
import ProductSales from 'src/components/dashboard/ProductSales';
import RecentTransactionCard from 'src/components/dashboard/RecentTransactions';
import SalesProfit from 'src/components/dashboard/SalesProfit';
import TopPayingClients from 'src/components/dashboard/TopPayingClients';
import TrafficDistribution from 'src/components/dashboard/TrafficDistribution';
import img1 from "../../../public/Images/top-error-shape.png"
import img2 from "../../../public/Images/top-info-shape.png"
import img3 from "../../../public/Images/top-warning-shape.png"

const Dashboard = () => {
  // Sample data for charts
  const degreeWiseData = {
    labels: ['B.Tech', 'MBA', 'B.Sc', 'M.Tech', 'B.Com'],
    datasets: [
      {
        label: 'Paid Applications',
        data: [25, 18, 12, 8, 7],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 1
      }
    ]
  };

  const classWiseData = {
    labels: ['Class I', 'Class II', 'Class III', 'Class IV', 'Class V'],
    datasets: [
      {
        label: 'Paid Applications',
        data: [15, 22, 18, 10, 5],
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 2
      }
    ]
  };

  // Function to render a simple chart (in a real app, you'd use a charting library)
  const renderChart = (data, isBarChart = false) => {
    const maxValue = Math.max(...data.datasets[0].data);

    return (
      <div className="h-80 p-4">
        {isBarChart ? (
          // Bar chart visualization
          <div className="h-full flex items-end justify-between space-x-2">
            {data.datasets[0].data.map((value, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${(value / maxValue) * 100}%` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">{data.labels[index]}</span>
                <span className="text-xs font-semibold">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          // Pie chart visualization
          <div className="h-full flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-gray-200">
              {data.datasets[0].data.map((value, index) => {
                const percentage = (value / 70) * 100; // 70 is total paid applications
                const rotation = data.datasets[0].data
                  .slice(0, index)
                  .reduce((sum, current) => sum + (current / 70) * 360, 0);

                return (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                      clipPath: `conic-gradient(from ${rotation}deg, transparent 0%, transparent ${percentage}%, ${data.datasets[0].backgroundColor[index]} ${percentage}%, ${data.datasets[0].backgroundColor[index]} 100%)`
                    }}
                  ></div>
                );
              })}
              <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">70</span>
                <span className="text-xs block">Total</span>
              </div>
            </div>
            <div className="ml-8">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                  ></div>
                  <span className="text-sm">{label}: {data.datasets[0].data[index]}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        {/* Statistics Cards - Updated with #0085db background */}
        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img2}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path strokeLinecap="round" d="M9 14h3m-2-2V8.2c0-.186 0-.279.012-.356a1 1 0 0 1 .832-.832C10.92 7 11.014 7 11.2 7h2.3a2.5 2.5 0 0 1 0 5zm0 0v5m0-5H9"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">92</h4>
              <span className="text-sm text-white text-opacity-90 font-medium">Total Applications</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img1}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12" opacity="0.5"></path>
                    <path d="M2 14c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 6.545C5.8 6 7.2 6 10 6h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 9.8 22 11.2 22 14s0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 22 16.8 22 14 22h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 18.2 2 16.8 2 14Z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m0 0l2.5-2.5M12 17l-2.5-2.5"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">70</h4>
              <span className="text-sm text-white text-opacity-90 font-medium">Paid Applications</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img2}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path strokeLinecap="round" d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">0</h4>
              <span className="text-sm text-white text-opacity-90 font-medium">Failed Applications</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img3}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path strokeLinecap="round" d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">22</h4>
              <span className="text-sm text-white text-opacity-90 font-medium">Incomplete Applications</span>
            </div>
          </div>
        </div>

        {/* Charts Section - Background remains white */}
        <div className="lg:col-span-6 col-span-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">Degree Wise Paid Application</h5>
                <p className="text-sm text-gray-500">Distribution of paid applications by degree</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              {renderChart(degreeWiseData)}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 col-span-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">Class Wise Paid Application</h5>
                <p className="text-sm text-gray-500">Distribution of paid applications by class</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              {renderChart(classWiseData, true)}
            </div>
          </div>
        </div>

        {/* Applications Table - Background remains white */}
        <div className="col-span-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h5 className="text-lg font-semibold text-gray-900">Recently Added Application</h5>
                <h6 className="text-sm text-gray-600">Application List across all Academic</h6>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                    <path d="M21 21l-6 -6"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Applications"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree/Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 1, name: "Gopal s Sharma", academic: "New Genius Academy High School Sanwer", rollNo: "2025000001", degree: "II", status: "Captured" },
                    { id: 2, name: "Test", academic: "Avantika University Ujjain", rollNo: "2025070004", degree: "ME", status: "Captured" },
                    { id: 3, name: "shaan", academic: "Avantika University Ujjain", rollNo: "2025070003", degree: "ME", status: "Captured" },
                    { id: 4, name: "Gopal sharma", academic: "Avantika University Ujjain", rollNo: "2025070002", degree: "ME", status: "Captured" },
                    { id: 5, name: "Gopal", academic: "Avantika University Ujjain", rollNo: "2025070001", degree: "ME", status: "Captured" }
                  ].map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{app.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{app.academic}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                        <span className="cursor-default">{app.rollNo}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.degree}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">1–5 of 5</span>
                <button className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50" disabled>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;