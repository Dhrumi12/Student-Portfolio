import Header from './Header.jsx'
import About from './About.jsx'
import Skills from './Skills.jsx'
import Footer from './Footer.jsx'
import PortfolioProjects from './PortfolioProjects.jsx'

function Home() {
  const skillList = ['HTML', 'CSS', 'JavaScript', 'React', 'Git']
  const bio =
    'I am a student developer learning React component architecture and reusable UI design.'
  const name = 'Dhrumi'
  const email = 'dhrumi@studentmail.example'
  const projects = [
    { name: 'Student Portfolio', description: 'A reusable React portfolio with routing and theme controls.' },
    { name: 'Task Manager', description: 'A full-stack CRUD workspace backed by Express and MongoDB.' },
    { name: 'Contact Hub', description: 'A controlled contact form with validation and persistence.' },
  ]

  return (
    <>
      <Header name={name} themeColor="#7c3aed" />
      <About bio={bio} />
      <Skills skillList={skillList} />
      <PortfolioProjects projects={projects} />
      <Footer email={email} />
    </>
  )
}

export default Home
