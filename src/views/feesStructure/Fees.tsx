import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader'
import FormVertical from './components/FormVertical'

const Fees = () => {
  return (
    <div className="p-6 space-y-6">
        <BreadcrumbHeader
        title="Fees Structure"
        paths={[{ name: "Fees Structure", link: "#" }]}
      />

      <FormVertical />
    </div>
  )
}

export default Fees