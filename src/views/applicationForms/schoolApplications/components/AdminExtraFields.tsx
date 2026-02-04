import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";

const AdminExtraFields = ({ applicationId }) => {
  const [remark, setRemark] = useState('');
  const [chequeRemark, setChequeRemark] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!remark && (!chequeRemark || !file)) {
      toast.error('Remark & proof required');
      return;
    }

    const formData = new FormData();
    formData.append('application_id', String(applicationId));
    formData.append('remark', remark);
    if (file) formData.append('proof', file);

    await axios.post('/admin/save-extra-details', formData);
    toast.success('Application completed');
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
      <h3 className="font-semibold">Admin Remarks</h3>

      <Textarea
        placeholder="Remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        required
      />

      <Textarea
        placeholder="Cheque Remark"
        value={chequeRemark}
        onChange={(e) => setChequeRemark(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        required
      />

      <Button onClick={handleSubmit} className="bg-blue-600 text-white">
        Save & Finish
      </Button>
    </div>
  );
};

export default AdminExtraFields;