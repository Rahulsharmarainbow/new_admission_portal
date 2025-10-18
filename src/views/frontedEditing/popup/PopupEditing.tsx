import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader'
import PopupForm from './components/PopupForm'

const PopupEditing = () => {
  return (
    <div className="p-6 space-y-6">
        <BreadcrumbHeader
        title="Popup Editing"
        paths={[{ name: "Popup Editing", link: "#" }]}
      />

      <PopupForm />
    </div>
  )
}

export default PopupEditing