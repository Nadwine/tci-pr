import React, { useState } from "react";
import { Dropdown, DropdownButton, Offcanvas } from "react-bootstrap";
import { connect } from "react-redux";
import Tenancy from "../../database/models/tenancy";

type Props = {
  onGoingTenancies: Tenancy[] | undefined;
  showInviteCanvas: boolean;
  setShowInviteCanvas: (boolean: boolean) => void;
  sendInvite: (email: string, firstName: string, lastName: string) => void;
};

const InvitationCanvas = (props: Props) => {
  const { onGoingTenancies, showInviteCanvas, setShowInviteCanvas, sendInvite } = props;

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addTo, setAddTo] = useState("");
  const [existingTenancyId, setExistingTenancyId] = useState("");
  const selectedTenancy = onGoingTenancies?.filter(tc => tc.Tenants.find(t => t.id === tc.leadTenantid && tc.id === Number(existingTenancyId)))[0];
  const selectedLead = selectedTenancy?.Tenants.find(t => t.id === selectedTenancy.leadTenantid);
  const selectedLeadString = `${selectedLead?.firstName || ""} ${selectedLead?.lastName || ""}`.trim();

  return (
    <Offcanvas show={showInviteCanvas} onHide={() => setShowInviteCanvas(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Invite to tenancy</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="d-flex flex-column">
          <div className="py-2">
            <label>Tenant email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
          </div>
          <div className="py-2">
            <label>Tenant First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" />
          </div>
          <div className="py-2">
            <label>Tenant Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" />
          </div>
          {/* <div className="py-2 d-flex flex-row align-items-center">
            <label>Add tenant to</label>
            <DropdownButton onSelect={val => setAddTo(val || "")} className="ps-2" variant="secondary" title={addTo || "Options"}>
              <Dropdown.Item eventKey="Existing Tenancy">Existing Tenancy</Dropdown.Item>
              <Dropdown.Item eventKey="As new tenant">As new tenant</Dropdown.Item>
            </DropdownButton>
          </div> */}
          {addTo === "Existing Tenancy" && (
            <div className="py-2">
              <DropdownButton
                onSelect={val => setExistingTenancyId(val || "")}
                className="ps-2"
                variant="secondary"
                title={selectedLeadString || "Select Tenancy"}
              >
                {onGoingTenancies?.map((tc, i) => {
                  const leadTenant = tc.Tenants.find(t => tc.leadTenantid === t.id);
                  return (
                    <Dropdown.Item key={i} eventKey={tc.id}>
                      {leadTenant?.firstName} {leadTenant?.lastName}
                    </Dropdown.Item>
                  );
                })}
              </DropdownButton>
            </div>
          )}
        </div>
        <div>
          <button onClick={() => sendInvite(email, firstName, lastName)} className="btn btn-primary">
            Send Invite
          </button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default connect()(InvitationCanvas);
