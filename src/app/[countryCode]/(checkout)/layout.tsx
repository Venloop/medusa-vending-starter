import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav disableCartDropdown={true} />
      {children}
      <Footer />
    </>
  )
}
