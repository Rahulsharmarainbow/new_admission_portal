import { useState } from "react";
import AcademicDropdown from "src/Frontend/Common/AcademicDropdown";
import ApplyForm from "src/Frontend/Main/collageApply/ApplyForm";
import SchoolApplyForm from "src/Frontend/Main/schoolApply/SchoolApplyForm";
import AdminExtraFields from "./AdminExtraFields";

const AdminAddApplication = ({ onClose }) => {
  const [academicId, setAcademicId] = useState('');
  const [routeType, setRouteType] = useState<'school' | 'college'>('');
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [showExtra, setShowExtra] = useState(false);

  const handleFirstStepSaved = (appId) => {
    setApplicationId(appId);
    setShowExtra(true);
  };

  return (
    <div className="space-y-6">
      {/* TOP FILTERS */}
      <div className="grid grid-cols-2 gap-4">
        <AcademicDropdown
          value={academicId}
          onChange={setAcademicId}
          placeholder="Select academic..."
        />

        <select
          className="border rounded-lg p-2"
          value={routeType}
          onChange={(e) => setRouteType(e.target.value as any)}
        >
          <option value="">Select Form Type</option>
          <option value="school">School</option>
          <option value="college">College</option>
        </select>
      </div>

      {/* FORM */}
      {academicId && routeType === 'school' && (
        <SchoolApplyForm
          academic_id={academicId}
          type="school"
          isAdmin={true}
          onFirstStepSaved={handleFirstStepSaved}
        />
      )}

      {academicId && routeType === 'college' && (
        <ApplyForm
          academic_id={academicId}
          type="college"
          isAdmin={true}
          onFirstStepSaved={handleFirstStepSaved}
        />
      )}

      {/* EXTRA FIELDS */}
      {showExtra && (
        <AdminExtraFields applicationId={applicationId} />
      )}
    </div>
  );
};

export default AdminAddApplication;
