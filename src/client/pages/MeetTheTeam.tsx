import React, { useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { connect } from "react-redux";

const chrisFullText = `Christma has managed a number of teams and brings a wealth of experience in operation management, business administration and customer service management to drive the success of TCI Homebase Property Management. 
Christma will oversee the development and functioning of TCI Homebase here in the Turks and Caicos Islands. 
Christma has a proven track record for improving efficiency, executing strategies and successfully leading teams and projects. She graduated with a First Class Honors Bachelor of Arts Degree in Business Management with Law at the Manchester Metropolitan University. 
Prior to joining the TCI Homebase team, Christma held various roles including Food and Beverage Manager at Holiday Inn Manchester West where she successfully implemented strategies to improve guest experience scores and the hotel operation. At Go Native Manchester, Christma spearheaded training initiatives and enhanced operational procedures to increase efficiency at the Front Office to boost guest satisfaction scores. Other roles held by Christma also include Business and Finance Administrative roles, and Project Leader and she was also a Data Analyst at Bank of New York Mellon. 
Christma's entrepreneurial spirit and her passion for the growth and development of the Turks and Caicos Islands have driven her back home to head this development with her team of specialists. Together, we aim to deliver the best service and value to our clients and stakeholders.`;

const herbyFullText = `Herby has built a reputation for transforming entrepreneurial organizations into sustainable growth enterprises through organizational change, strategy and disciplined execution.
As Chief Financial & Operating Officer, Herby oversees all aspects of finance, accounting, and administration at TCI Homebase Property Management. A strategic thinker with a keen interest in enhancing internal platforms through technology and innovation, he takes time to understand and implement new tech as it pertains to conveying important information to clients.
Before joining the TCI Homebase team, Herby was the Administrative Coordinator/Accounts Receivable at Postmedia Network Inc., and prior to that he was a Financial Analyst and Business advisor at a leading watersports company, Waterscape Adventures in the Turks and Caicos Islands. Herby also holds a Bachelor’s Degree in Business Administration from Providence University College in Canada.`;

const samaFullText = `As Chief Technology Officer, Sama will oversee all aspects of data management and information technology within TCI Homebase Property Management. Leveraging his extensive industry knowledge and technological expertise, he determines the best security, communications, software and hardware protocols for the company, ensuring each element of IT functions safely and allows for the effective attainment of the organization mandates.
Sama’s journey in the corporate landscape unfolded with a tenure at Bet365, a global giant in the online betting industry. At Bet365, Sama immersed himself in the fast-paced and competitive environment, leveraging his expertise to contribute to the success of one of the world's largest online betting companies. Prior to his role at Bet365, Sama embarked on a multifaceted professional journey at Near-Life, an innovative E-Learning company. This period overlapped with his dedicated pursuit of a Bachelor's degree in Software Engineering at the esteemed University of Bolton in the United Kingdom. Sama's commitment to professional growth and academic excellence showcased his ability to balance the demands of the tech industry and his educational endeavors seamlessly.`;

const naeFullText = `Nadwine is a Software Engineer with expertise in full-stack development, demonstrating a strong proficiency in her field. In her current capacity, she serves as a pivotal member of our team, overseeing the design and development of the TCI Homebase Property Management website. In this role, she meticulously crafts and refines the website to ensure both its functionality and user experience align seamlessly with our organisational objectives. Nadwine is also responsible for the ongoing maintenance and optimisation of the site, ensuring it remains intuitive.
Possessing a distinguished academic background, Nadwine holds a Bachelor of Engineering degree in Software Engineering from the esteemed University of Bolton. This foundational education equips her with a comprehensive understanding of software engineering principles and best practices, which she consistently applies to her work.
Nadwine's professional journey includes valuable experience as a Software Engineer at Naimuri, UK. During her tenure there, she honed her skills in developing innovative solutions and contributing to the success of various projects. Her tenure at Naimuri underscores her commitment to excellence and her ability to thrive in dynamic and collaborative work environments.
With a passion for staying abreast of emerging technologies and industry trends, Nadwine remains dedicated to continuous learning and professional development. Her combination of academic and practical experience positions her as a valuable asset to the company.`;

const MeetTheTeam = props => {
  const [chrisOpen, setChrisOpen] = useState(false);
  const [herbyOpen, setHerbyOpen] = useState(false);
  const [samaOpen, setSamaOpen] = useState(false);
  const [naeOpen, setNamOpen] = useState(false);
  const imgContainerStyle = {
    width: "210px",
    height: "250px",
    backgroundColor: "grey"
  };
  return (
    <div className="page-met-the-team">
      <div
        className="title fs-1 d-flex align-items-center ps-md-5"
        style={{ height: "180px", backgroundColor: "#68bece", borderBottomRightRadius: "120px", width: "80%" }}
      >
        <div className="ps-2 ps-md-5 strong-text">
          <div className="col-9">The Organisation</div>
          <div className="sub-title" style={{ fontSize: "15px" }}>
            Meet Our Founders
          </div>
        </div>
      </div>
      <div className="d-flex flex-wrap pt-5">
        <div className="col-12 col-md-6 d-flex align-items-center flex-column pb-5 px-1">
          <div className="img-container rounded" style={imgContainerStyle}>
            <img className="rounded" src="/static/chrissy headshot.jpeg" style={{ width: "100%", height: "100%" }}></img>
          </div>
          <div className="fs-5 pt-3">Christma Jean-Louis</div>
          <div className="text-decoration-underline pb-2" style={{ fontSize: "15px" }}>
            Chief Executive Officer
          </div>
          {!chrisOpen && (
            <div className="px-md-5 text-center" style={{ height: "70px", overflow: "hidden" }}>
              Christma has managed a number of teams and brings a wealth of experience in operation management, business..
            </div>
          )}
          <Collapse in={chrisOpen}>
            <div className="px-md-5 text-center">{chrisFullText}</div>
          </Collapse>
          <Button onClick={() => setChrisOpen(!chrisOpen)} aria-controls="example-collapse-text" variant="link" style={{ color: "#11828d" }}>
            {chrisOpen ? "Close" : "Read More"}
          </Button>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center flex-column pb-5 px-1">
          <div className="img-container rounded" style={imgContainerStyle}>
            <img className="rounded" src="/static/Herby Headshot.jpeg" style={{ width: "100%", height: "100%" }}></img>
          </div>
          <div className="fs-5 pt-3">Herby Magny</div>
          <div className="text-decoration-underline pb-2" style={{ fontSize: "15px" }}>
            Chief Financial Officer
          </div>
          {!herbyOpen && (
            <div className="px-md-5 text-center smaller-text" style={{ height: "70px", overflow: "hidden" }}>
              Herby has built a reputation for transforming entrepreneurial organizations into sustainable growth enterprises..
            </div>
          )}
          <Collapse in={herbyOpen}>
            <div className="px-md-5 text-center">{herbyFullText}</div>
          </Collapse>
          <Button onClick={() => setHerbyOpen(!herbyOpen)} aria-controls="example-collapse-text" variant="link" style={{ color: "#11828d" }}>
            {herbyOpen ? "Close" : "Read More"}
          </Button>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center flex-column pb-5 px-1">
          <div className="img-container rounded" style={imgContainerStyle}>
            <img className="rounded" src="/static/sama headshot.jpeg" style={{ width: "100%", height: "100%" }}></img>
          </div>
          <div className="fs-5 pt-3">Brutchsama Jean-Louis</div>
          <div className="text-decoration-underline pb-2" style={{ fontSize: "15px" }}>
            Chief Technology Officer
          </div>
          {!samaOpen && (
            <div className="px-md-5 text-center smaller-text" style={{ height: "70px", overflow: "hidden" }}>
              As Chief Technology Officer, Sama oversees all aspects of data management and information technology within..
            </div>
          )}
          <Collapse in={samaOpen}>
            <div className="px-md-5 text-center">{samaFullText}</div>
          </Collapse>
          <Button onClick={() => setSamaOpen(!samaOpen)} aria-controls="example-collapse-text" variant="link" style={{ color: "#11828d" }}>
            {samaOpen ? "Close" : "Read More"}
          </Button>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center flex-column px-1">
          <div className="img-container rounded" style={imgContainerStyle}>
            <img className="rounded" src="/static/Nae Headshot.jpeg" style={{ width: "100%", height: "100%" }}></img>
          </div>
          <div className="fs-5 pt-3">Nadwine Louis</div>
          <div className="text-decoration-underline pb-2" style={{ fontSize: "15px" }}>
            Software Engineer
          </div>
          {!naeOpen && (
            <div className="px-md-5 text-center smaller-text" style={{ height: "70px", overflow: "hidden" }}>
              Nadwine is a Software Engineer with expertise in full-stack development, demonstrating a strong proficiency in her..
            </div>
          )}
          <Collapse in={naeOpen}>
            <div className="px-md-5 text-center">{naeFullText}</div>
          </Collapse>
          <Button onClick={() => setNamOpen(!naeOpen)} aria-controls="example-collapse-text" variant="link" style={{ color: "#11828d" }}>
            {naeOpen ? "Close" : "Read More"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default connect()(MeetTheTeam);
