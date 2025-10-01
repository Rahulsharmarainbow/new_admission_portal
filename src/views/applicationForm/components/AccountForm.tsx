// import React, { useState, ChangeEvent, FormEvent } from 'react';

// const AccountForm = () => {
//   const [formData, setFormData] = useState({
//     organizationName: '',
//     type: '',
//     primaryEmail: '',
//     secondaryEmail: '',
//     website: '',
//     phoneNumber: '',
//     establishedDate: '',
//     city: '',
//     country: '',
//     postalCode: '',
//     numberOfEmployees: '',
//     annualRevenue: '',
//     industry: '',
//     companyDescription: '',
//     acceptedTerms: false,
//     subscriptionPlan: '',
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     // Use a type guard to safely get the 'checked' property for checkboxes
//     const newValue = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

//     setFormData(prevState => ({
//       ...prevState,
//       [name]: newValue,
//     }));
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log('Form data submitted:', formData);
//     // You would typically send this data to an API here
//     // A confirmation message could be displayed here instead of an alert
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-xl">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Account</h1>
//         <p className="text-center text-gray-500 mb-8">
//           Fill out the details below to register a new account.
//         </p>
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Row 1 */}
//             <div className="col-span-1">
//               <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
//               <input
//                 type="text"
//                 id="organizationName"
//                 name="organizationName"
//                 value={formData.organizationName}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="e.g., Starlink Academy"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
//               <input
//                 type="url"
//                 id="website"
//                 name="website"
//                 value={formData.website}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="https://www.example.com"
//               />
//             </div>

//             {/* Row 2 */}
//             <div className="col-span-1">
//               <label htmlFor="primaryEmail" className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
//               <input
//                 type="email"
//                 id="primaryEmail"
//                 name="primaryEmail"
//                 value={formData.primaryEmail}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="contact@example.com"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
//               <input
//                 type="email"
//                 id="secondaryEmail"
//                 name="secondaryEmail"
//                 value={formData.secondaryEmail}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="alt.contact@example.com"
//               />
//             </div>

//             {/* Row 3 */}
//             <div className="col-span-1">
//               <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 name="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="+1 555-123-4567"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700 mb-1">Date Established</label>
//               <input
//                 type="date"
//                 id="establishedDate"
//                 name="establishedDate"
//                 value={formData.establishedDate}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>

//             {/* Row 4 */}
//             <div className="col-span-1">
//               <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="e.g., New York"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//               <input
//                 type="text"
//                 id="country"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="e.g., United States"
//               />
//             </div>

//             {/* Row 5 */}
//             <div className="col-span-1">
//               <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
//               <input
//                 type="text"
//                 id="postalCode"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="e.g., 10001"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
//               <select
//                 id="type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">Select a type</option>
//                 <option value="School">School</option>
//                 <option value="College">College</option>
//                 <option value="University">University</option>
//                 <option value="Training Center">Training Center</option>
//               </select>
//             </div>
            
//             {/* Row 6 */}
//             <div className="col-span-1">
//               <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
//               <input
//                 type="number"
//                 id="numberOfEmployees"
//                 name="numberOfEmployees"
//                 value={formData.numberOfEmployees}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
//             <div className="col-span-1">
//               <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue ($)</label>
//               <input
//                 type="number"
//                 id="annualRevenue"
//                 name="annualRevenue"
//                 value={formData.annualRevenue}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               />
//             </div>
            
//             {/* Row 7 */}
//             <div className="col-span-1">
//               <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
//               <input
//                 type="text"
//                 id="industry"
//                 name="industry"
//                 value={formData.industry}
//                 onChange={handleChange}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="e.g., Education"
//               />
//             </div>
//             <div className="col-span-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
//               <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="subscriptionPlan"
//                     value="Basic"
//                     checked={formData.subscriptionPlan === 'Basic'}
//                     onChange={handleChange}
//                     className="form-radio text-indigo-600 h-4 w-4"
//                   />
//                   <span className="ml-2 text-gray-700">Basic</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="subscriptionPlan"
//                     value="Premium"
//                     checked={formData.subscriptionPlan === 'Premium'}
//                     onChange={handleChange}
//                     className="form-radio text-indigo-600 h-4 w-4"
//                   />
//                   <span className="ml-2 text-gray-700">Premium</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     name="subscriptionPlan"
//                     value="Enterprise"
//                     checked={formData.subscriptionPlan === 'Enterprise'}
//                     onChange={handleChange}
//                     className="form-radio text-indigo-600 h-4 w-4"
//                   />
//                   <span className="ml-2 text-gray-700">Enterprise</span>
//                 </label>
//               </div>
//             </div>

//             {/* Row 8 (full-width) */}
//             <div className="md:col-span-2">
//               <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
//               <textarea
//                 id="companyDescription"
//                 name="companyDescription"
//                 value={formData.companyDescription}
//                 onChange={handleChange}
//                 rows={4}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Provide a brief description of the organization..."
//               ></textarea>
//             </div>

//             {/* Row 9 (full-width) */}
//             <div className="md:col-span-2">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="acceptedTerms"
//                   name="acceptedTerms"
//                   checked={formData.acceptedTerms}
//                   onChange={handleChange}
//                   required
//                   className="form-checkbox h-4 w-4 text-indigo-600 rounded"
//                 />
//                 <label htmlFor="acceptedTerms" className="ml-2 block text-sm text-gray-900">
//                   I accept the <a href="#" className="text-indigo-600 hover:underline">Terms and Conditions</a>.
//                 </label>
//               </div>
//             </div>
//           </div>
          
//           <div className="text-center mt-8">
//             <button
//               type="submit"
//               className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Submit Account
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AccountForm;






















import React, { useState, ChangeEvent, FormEvent } from 'react';

const AccountForm = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    type: '',
    primaryEmail: '',
    secondaryEmail: '',
    website: '',
    phoneNumber: '',
    establishedDate: '',
    city: '',
    country: '',
    postalCode: '',
    numberOfEmployees: '',
    annualRevenue: '',
    industry: '',
    companyDescription: '',
    acceptedTerms: false,
    subscriptionPlan: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prevState => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="rounded-xl shadow-md bg-white p-6 relative w-full break-words">
        <h5 className="text-3xl font-bold text-center text-gray-800 mb-6">Create New Account</h5>
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-6 col-span-12">
                <div className="flex flex-col gap-4">
                  {/* Organization Name */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                    </div>
                    <input
                      id="organizationName"
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      placeholder="e.g., Starlink Academy"
                      required
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Primary Email */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="primaryEmail" className="block text-sm font-medium text-gray-700">Primary Email</label>
                    </div>
                    <input
                      id="primaryEmail"
                      type="email"
                      name="primaryEmail"
                      value={formData.primaryEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      required
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Phone Number */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 555-123-4567"
                      required
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* City */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                    </div>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., New York"
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Postal Code */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                    </div>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g., 10001"
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                   {/* Number of Employees */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="numberOfEmployees" className="block text-sm font-medium text-gray-700">Number of Employees</label>
                    </div>
                    <input
                      id="numberOfEmployees"
                      type="number"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                   {/* Industry */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                    </div>
                    <input
                      id="industry"
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      placeholder="e.g., Education"
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Company Description */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">Company Description</label>
                    </div>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Provide a brief description of the organization..."
                    ></textarea>
                  </div>
                  {/* Accepted Terms */}
                  <div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="acceptedTerms"
                        name="acceptedTerms"
                        checked={formData.acceptedTerms}
                        onChange={handleChange}
                        required
                        className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="acceptedTerms" className="ml-2 block text-sm text-gray-900">
                        I accept the <a href="#" className="text-indigo-600 hover:underline">Terms and Conditions</a>.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="lg:col-span-6 col-span-12">
                <div className="flex flex-col gap-4">
                  {/* Website URL */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website URL</label>
                    </div>
                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                      required
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Secondary Email */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="secondaryEmail" className="block text-sm font-medium text-gray-700">Secondary Email</label>
                    </div>
                    <input
                      id="secondaryEmail"
                      type="email"
                      name="secondaryEmail"
                      value={formData.secondaryEmail}
                      onChange={handleChange}
                      placeholder="alt.contact@example.com"
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Established Date */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="establishedDate" className="block text-sm font-medium text-gray-700">Date Established</label>
                    </div>
                    <input
                      id="establishedDate"
                      type="date"
                      name="establishedDate"
                      value={formData.establishedDate}
                      onChange={handleChange}
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Country */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                    </div>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., United States"
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Organization Type */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">Organization Type</label>
                    </div>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    >
                      <option value="">Select a type</option>
                      <option value="School">School</option>
                      <option value="College">College</option>
                      <option value="University">University</option>
                      <option value="Training Center">Training Center</option>
                    </select>
                  </div>
                  {/* Annual Revenue */}
                  <div>
                    <div className="mb-2 block">
                      <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700">Annual Revenue ($)</label>
                    </div>
                    <input
                      id="annualRevenue"
                      type="number"
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleChange}
                      className="form-control form-rounded-xl w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>
                  {/* Subscription Plan */}
                  <div>
                    <div className="mb-2 block">
                      <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="subscriptionPlan"
                          value="Basic"
                          checked={formData.subscriptionPlan === 'Basic'}
                          onChange={handleChange}
                          className="form-radio text-indigo-600 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700">Basic</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="subscriptionPlan"
                          value="Premium"
                          checked={formData.subscriptionPlan === 'Premium'}
                          onChange={handleChange}
                          className="form-radio text-indigo-600 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700">Premium</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="subscriptionPlan"
                          value="Enterprise"
                          checked={formData.subscriptionPlan === 'Enterprise'}
                          onChange={handleChange}
                          className="form-radio text-indigo-600 h-4 w-4"
                        />
                        <span className="ml-2 text-gray-700">Enterprise</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-12 flex justify-center mt-4 gap-3">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountForm;
