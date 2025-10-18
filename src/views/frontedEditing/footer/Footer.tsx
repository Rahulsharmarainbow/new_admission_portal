import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader'
import FooterForm from './components/FooterForm'

const FooterEditing = () => {
  return (
    <div className="p-6 space-y-6">
        <BreadcrumbHeader
        title="Footer Editing"
        paths={[{ name: "Footer Editing", link: "#" }]}
      />

      <FooterForm />
    </div>
  )
}

export default FooterEditing