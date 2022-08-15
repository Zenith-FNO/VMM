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
            longPositions = sp.map(tkey = sp.TPair(sp.TAddress, sp.TString),
                                    tvalue = sp.TRecord(
                                        token_amount = sp.TNat,
                                        vUSD_Amount  = sp.TNat
                                    )),
            shortPositions = sp.map(tkey = sp.TPair(sp.TAddress, sp.TString),
                                    tvalue = sp.TRecord(
                                        token_amount = sp.TNat,
                                        vUSD_Amount  = sp.TNat
                                    )),
            vUSD_contract_address = vUSD_address
        )
    
    def _onlyAdmin(self):
        sp.verify(sp.sender == self.data.administrator, self.error.adminOnly())

    def _vmmExists(self, vmm_name):
        sp.verify(~self.data.vmm_state.contains(vmm_name), self.error.vmmExists())



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
        x = sp.local('x', (self.data.vmm_state[state_name].Invariant/(self.data.vmm_state[state_name].vUSD_Amount + (sp.mul(leverage_multiple, base_value)))) - self.data.vmm_state[state_name].Token_Amount)
        self.data.longPositions[sp.pair(sp.sender, state_name)] = sp.record(
                                        token_amount = abs(x.value),
                                        vUSD_Amount  = sp.mul(leverage_multiple, base_value)
                                    )
        self.data.vmm_state[state_name].vUSD_Amount += sp.mul(leverage_multiple, base_value)
        self.data.vmm_state[state_name].Token_Amount = abs(self.data.vmm_state[state_name].Token_Amount - abs(x.value))

    @sp.entry_point
    def closeLong(self, state_name,):
        sp.set_type(state_name, sp.TString)
        x = sp.local('x', abs(self.data.vmm_state[state_name].vUSD_Amount - (self.data.vmm_state[state_name].Invariant/(self.data.vmm_state[state_name].Token_Amount + self.data.longPositions[sp.pair(sp.sender, state_name)].token_amount))))
        self.transferVusdToUser(x.value, state_name)
        self.data.vmm_state[state_name].vUSD_Amount = abs(self.data.vmm_state[state_name].vUSD_Amount - x.value)
        self.data.vmm_state[state_name].Token_Amount += self.data.longPositions[sp.pair(sp.sender, state_name)].token_amount
        del self.data.longPositions[sp.pair(sp.sender, state_name)]
    
    @sp.entry_point
    def openShort(self, leverage_multiple, base_value, state_name):
        sp.set_type(leverage_multiple, sp.TNat)
        sp.set_type(base_value, sp.TNat)
        sp.set_type(state_name, sp.TString)
        self.transferVusdFromUser(sp.mul(leverage_multiple, base_value))
        x = sp.local('x', (self.data.vmm_state[state_name].Invariant/abs((self.data.vmm_state[state_name].vUSD_Amount - (sp.mul(leverage_multiple, base_value)))) - self.data.vmm_state[state_name].Token_Amount))
        self.data.shortPositions[sp.pair(sp.sender, state_name)] = sp.record(
                                        token_amount = abs(x.value),
                                        vUSD_Amount  = sp.mul(leverage_multiple, base_value)
                                    )
        self.data.vmm_state[state_name].vUSD_Amount = abs(self.data.vmm_state[state_name].vUSD_Amount - sp.mul(leverage_multiple, base_value))
        self.data.vmm_state[state_name].Token_Amount += abs(x.value)


    @sp.entry_point
    def closeShort(self, state_name):
        sp.set_type(state_name, sp.TString)
        x = sp.local('x', (self.data.vmm_state[state_name].Invariant/abs(self.data.vmm_state[state_name].Token_Amount - self.data.shortPositions[sp.pair(sp.sender, state_name)].token_amount) - self.data.vmm_state[state_name].vUSD_Amount))
        self.transferVusdToUser(abs(x.value), state_name)
        self.data.vmm_state[state_name].vUSD_Amount += abs(x.value)
        self.data.vmm_state[state_name].Token_Amount = abs(self.data.vmm_state[state_name].Token_Amount - self.data.shortPositions[sp.pair(sp.sender, state_name)].token_amount)
        del self.data.shortPositions[sp.pair(sp.sender, state_name)]





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
            Token_Amount = sp.nat(1000 * dc),
            vUSD_Amount  = sp.nat(10000 * dc),
            Invariant    = sp.nat(10000000 * dc * dc)
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
    sc += vmm.openLong(leverage_multiple = sp.nat(3), base_value = sp.nat(100 * dc), state_name = sp.string("ETH")).run(sender = mark.address)

    sc.h1("Open Short")
    sc += vmm.openShort(leverage_multiple = sp.nat(5), base_value = sp.nat(200 * dc), state_name = sp.string("ETH")).run(sender = elon.address)

    sc.h1("Close Long")
    sc += vmm.closeLong(sp.string("ETH")).run(sender = mark.address)

    sc.h1("Close Short")
    sc += vmm.closeShort(sp.string("ETH")).run(sender = elon.address)
