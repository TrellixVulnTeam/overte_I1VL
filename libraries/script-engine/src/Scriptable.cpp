//
//  Scriptable.cpp
//  libraries/script-engine/src
//
//  Created by Heather Anderson on 5/22/21.
//  Copyright 2021 Vircadia contributors.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#include "Scriptable.h"

static thread_local ScriptContext* ScriptContextStore;

ScriptContext* Scriptable::context() {
    return ScriptContextStore;
}

void Scriptable::setContext(ScriptContext* context) {
    ScriptContextStore = context;
}
