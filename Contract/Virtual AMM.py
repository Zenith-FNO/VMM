import smartpy as sp
FA12 = sp.io.import_script_from_url('https://smartpy.io/templates/FA1.2.py')

class vUSD(FA12.FA12):
    pass

# ################

class Error_message :
    def adminOnly(self):
        return "ADMIN_ONLY"
    
    def vmmExists(self):
        return "VMM_ALREADY_EXISTS"
    
    def insufficentAmount(self):
        return "INSUFFICIENT_AMOUNT"

class VMM(sp.Contract):
    def __init__(self, admin, metadata, vUSD_address):
        self.error = Error_message()
        self.init(
            administrator = admin,
            matadata      = metadata,
            vmm_state     = sp.map(tkey = sp.TString, 
                                tvalue =sp.TRecord(
                                    Token_Amount = sp.TNat,
                                    vUSD_Amount  = sp.TNat,
                                    Invariant    = sp.TNat
                                )),
            positions     = sp.list([], t = sp.TString),
            vUSD_contract_address = vUSD_address
        )
    
    def _onlyAdmin(self):
        sp.verify(sp.sender == self.data.administrator, self.error.adminOnly())

    def _vmmExists(self, vmm_name):
        sp.verify(~self.data.vmm_state.contains(vmm_name), self.error.vmmExists())

    def calculateVusdAmount(self, leverage_multiple, base_value, state_name):
        new_vUSD_Amount = sp.local("new_vUSD_Amount", (self.data.vmm_state[state_name].vUSD_Amount + (base_value * leverage_multiple)))
        return sp.mul(self.data.vmm_state[state_name].Token_Amount, (self.data.vmm_state[state_name].vUSD_Amount))/ (new_vUSD_Amount.value)

    def calculateTokenAmount(self, amount, state_name):
        return self.data.vmm_state[state_name] + amount

    def transferVusdFromUser(self, amount):
        contractParams = sp.contract(sp.TRecord(from_ = sp.TAddress, to_ = sp.TAddress, value = sp.TNat), 
                                        sp.address("KT19mcZ91i9Uq711ghZWgk2JAtrfm8s8vxU2"),entry_point="transfer").open_some()
        dataToBeSent = sp.record(from_ = sp.sender, to_ = sp.self_address, value = amount)
        sp.transfer(dataToBeSent,sp.mutez(0),contractParams)

    def transferVusdToUser(self, amount, state_name):
        contractParams = sp.contract(sp.TRecord(from_ = sp.TAddress, to_ = sp.TAddress, value = sp.TNat), 
                                        sp.address("KT19mcZ91i9Uq711ghZWgk2JAtrfm8s8vxU2"),entry_point="transfer").open_some()
        dataToBeSent = sp.record(from_ = sp.self_address , to_ = sp.sender, value = amount)
        sp.transfer(dataToBeSent,sp.mutez(0),contractParams)

    @sp.entry_point
    def addVmmState(self, params):
        sp.set_type(params.state_name, sp.TString)
        sp.set_type(params.inital_state, sp.TRecord(
                                    Token_Amount = sp.TNat,
                                    vUSD_Amount  = sp.TNat,
                                    Invariant    = sp.TNat
                                ))        
        self._onlyAdmin()
        self._vmmExists(params.state_name)
        self.data.vmm_state[params.state_name] = params.inital_state

    @sp.entry_point
    def openLong(self, leverage_multiple, base_value, state_name):
        sp.set_type(leverage_multiple, sp.TNat)
        sp.set_type(base_value, sp.TNat)
        sp.set_type(state_name, sp.TString)
        self.transferVusdFromUser(sp.mul(leverage_multiple, base_value))
        # new_Amount = sp.local("new_Amount",)
        self.data.vmm_state[state_name].Token_Amount = self.calculateVusdAmount(leverage_multiple, base_value, state_name)
        self.data.vmm_state[state_name].vUSD_Amount += (leverage_multiple * base_value)


    @sp.entry_point
    def closeLong(self, amount, state_name):
        sp.set_type(amount, sp.TNat)
        amount_to_send = sp.local('amount_to_send', sp.mul(self.data.vmm_state[state_name].Token_Amount, self.data.vmm_state[state_name].vUSD_Amount) / (self.data.vmm_state[state_name].Token_Amount + amount))
        self.transferVusdToUser(amount_to_send.value, state_name)
        self.data.vmm_state[state_name].vUSD_Amount = abs(self.data.vmm_state[state_name].vUSD_Amount - amount_to_send.value)
        self.data.vmm_state[state_name].Token_Amount += amount


@sp.add_test(name = "VMM")
def test():
    dc = 1000000
    sc = sp.test_scenario()
    sc.h1("Virtual Automated Market Maker Smart Contract")
    sc.table_of_contents()
    admin = sp.address("tz1LXRS2zgh12gbGix6R9xSLJwfwqM9VdpPW")
    mark = sp.test_account("mark")
    elon = sp.test_account("elon")
    sc.h1("Accounts")
    sc.show([mark, elon])

    # ###################

    token_metadata = {
        "name": "VMM USD Simulated",
        "symbol": "vUSD",
        "decimals": "6" #
    }

    sc.h1("Code: VMM USD Simulated(FA1.2)")
    vusd = vUSD(
        admin, # Update the admin address before deployement to the chain. 
        config = FA12.FA12_config(),
        token_metadata = token_metadata,
    )
    sc += vusd

    # ###################

    vmm = VMM(admin = admin, 
            metadata = sp.utils.metadata_of_url("ipfs://bafkreic6r6e7qc4atifm35kxdl4dtga7df6eyrqfovchka7qvedxuoujxi"), 
            vUSD_address = sp.address("KT19mcZ91i9Uq711ghZWgk2JAtrfm8s8vxU2"))
    sc.h1("Code")   
    sc += vmm

    # ###################

    sc.h1("Approve Contract")
    vusd_data = sp.record(
            spender= vmm.address,
            value= sp.nat(5)
            )
    # sc += vusd.approve(vusd_data).run(sender = mark.address)
    # sc += vusd.mint(sp.record(address = elon.address, value = sp.nat(10))).run(sender = admin) 
    # sc += vusd.mint(sp.record(address = mark.address, value = sp.nat(7))).run(sender = admin) 
    # # sc += vusd.transfer(sp.record(from_ = mark.address, to_ = vmm.address, value = sp.nat(2))).run(sender = vmm.address)


    sc.h1("Add VMM State")
    state1 = sp.record(
            Token_Amount = sp.nat(100 * dc),
            vUSD_Amount  = sp.nat(400000 * dc),
            Invariant    = sp.nat(40000000 * dc * dc)
        )
    sc += vmm.addVmmState(sp.record(state_name = sp.string("ETH"), inital_state = state1)).run(sender = admin)
    sc += vmm.addVmmState(sp.record(state_name = sp.string("ETH"), inital_state = state1)).run(sender = elon, valid = False)
    sc += vmm.addVmmState(sp.record(state_name = sp.string("ETH"), inital_state = state1)).run(sender = admin, valid = False)
    state2 = sp.record(
            Token_Amount = sp.nat(12500 * dc),
            vUSD_Amount  = sp.nat(100000 * dc),
            Invariant    = sp.nat(1250000000 * dc * dc)
        )
    sc += vmm.addVmmState(sp.record(state_name = sp.string("WAVES"), inital_state = state2)).run(sender = admin)

    # ###################

    sc.h1("Open Long")
    sc += vmm.openLong(leverage_multiple = sp.nat(2), base_value = sp.nat(2000 * dc), state_name = sp.string("ETH")).run(sender = mark.address)
    sc += vmm.openLong(leverage_multiple = sp.nat(2), base_value = sp.nat(2000 * dc), state_name = sp.string("WAVES")).run(sender = elon.address)

    sc.h1("Close Long")
    sc += vmm.closeLong(amount = sp.nat(990100), state_name = sp.string("ETH")).run(sender = mark.address)
    sc += vmm.closeLong(amount = sp.nat(480777000), state_name = sp.string("WAVES")).run(sender = elon.address)
